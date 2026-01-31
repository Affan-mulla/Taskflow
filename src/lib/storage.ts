import { storage, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Resize an image to specified dimensions
 */
const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio within bounds
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // For avatar, we want a square crop from center
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw cropped and resized image
      ctx.drawImage(img, sx, sy, size, size, 0, 0, maxWidth, maxHeight);

      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        },
        "image/webp",
        0.85
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload avatar to Firebase Storage
 * - Resizes to 256x256
 * - Converts to WebP
 * - Stores at /avatars/{userId}.webp
 * - Returns download URL
 */
export const uploadAvatar = async (file: File): Promise<{ 
  success: boolean; 
  url?: string; 
  error?: string 
}> => {
  const { currentUser } = auth;
  
  if (!currentUser) {
    return {
      success: false,
      error: "No authenticated user found",
    };
  }

  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please select an image file",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "Image must be less than 5MB",
      };
    }

    // Resize and convert to WebP
    const resizedBlob = await resizeImage(file, 256, 256);

    // Upload to Firebase Storage
    const avatarRef = ref(storage, `avatars/${currentUser.uid}.webp`);
    await uploadBytes(avatarRef, resizedBlob, {
      contentType: "image/webp",
    });

    // Get download URL
    const url = await getDownloadURL(avatarRef);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload avatar",
    };
  }
};
