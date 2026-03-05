export type UploadFolder = "avatars" | "workspace-logos" | "task-attachments";

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  url: string;
  resourceType: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
  originalFilename?: string;
  createdAt: string;
  folder?: string;
}

interface UploadToCloudinaryOptions {
  file: File;
  folder: UploadFolder;
  onProgress?: (progress: number) => void;
}

interface CloudinaryApiResponse {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
  original_filename?: string;
  created_at: string;
  folder?: string;
}

function getResourceType(file: File): "image" | "video" | "raw" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw"; // PDF, DOC, ZIP, CSV, and all other formats
}

export function uploadToCloudinary({
  file,
  folder,
  onProgress,
}: UploadToCloudinaryOptions): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      reject(new Error("Cloudinary environment variables are missing"));
      return;
    }

    const resourceType = getResourceType(file);
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);

    xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (!event.lengthComputable || !onProgress) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error("Upload failed. Please try again."));
        return;
      }

      try {
        const data = JSON.parse(xhr.responseText) as CloudinaryApiResponse;

        resolve({
          publicId: data.public_id,
          secureUrl: data.secure_url,
          url: data.url,
          resourceType: data.resource_type,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height,
          originalFilename: data.original_filename,
          createdAt: data.created_at,
          folder: data.folder,
        });
      } catch {
        reject(new Error("Invalid upload response from Cloudinary"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading file"));
    };

    xhr.send(formData);
  });
}
