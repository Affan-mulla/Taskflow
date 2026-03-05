import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Attachment01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { uploadToCloudinary, type CloudinaryUploadResult, type UploadFolder } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type UploadState = "queued" | "uploading" | "success" | "error";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  state: UploadState;
  error?: string;
  result?: CloudinaryUploadResult;
}

export interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  folder: UploadFolder;
  onUploadComplete: (results: CloudinaryUploadResult[]) => void;
  onError: (msg: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file: File, accept?: string): boolean {
  if (!accept?.trim()) return true;

  const tokens = accept
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return fileName.endsWith(token);
    }

    if (token.endsWith("/*")) {
      const mimeGroup = token.replace("/*", "");
      return fileType.startsWith(`${mimeGroup}/`);
    }

    return fileType === token;
  });
}

export function FileUpload({
  accept,
  maxSizeMB = 10,
  multiple = false,
  folder,
  onUploadComplete,
  onError,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const pickedFiles = Array.from(fileList);
    const candidates = multiple ? pickedFiles : pickedFiles.slice(0, 1);

    if (candidates.length === 0) return;

    const nextItems: UploadItem[] = candidates.map((file, index) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${index}`,
      file,
      progress: 0,
      state: "queued",
    }));

    setItems((prev) => [...prev, ...nextItems]);

    const validItems = nextItems.filter((item) => {
      if (!isAcceptedFile(item.file, accept)) {
        updateItem(item.id, { state: "error", error: "File type is not allowed" });
        onError(`Unsupported file type: ${item.file.name}`);
        return false;
      }

      if (item.file.size > maxBytes) {
        updateItem(item.id, {
          state: "error",
          error: `File exceeds ${maxSizeMB}MB limit`,
        });
        onError(`${item.file.name} exceeds ${maxSizeMB}MB`);
        return false;
      }

      return true;
    });

    const uploadResults = await Promise.all(
      validItems.map(async (item) => {
        updateItem(item.id, { state: "uploading", progress: 0 });

        try {
          const result = await uploadToCloudinary({
            file: item.file,
            folder,
            onProgress: (progress) => updateItem(item.id, { progress }),
          });

          updateItem(item.id, {
            state: "success",
            progress: 100,
            result,
          });

          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Upload failed";
          updateItem(item.id, {
            state: "error",
            error: message,
          });
          onError(`${item.file.name}: ${message}`);
          return null;
        }
      })
    );

    const successful = uploadResults.filter((result): result is CloudinaryUploadResult => result !== null);

    if (successful.length > 0) {
      onUploadComplete(successful);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    processFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    processFiles(event.dataTransfer.files);
  };

  const clearItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border-2 border-dashed p-4 bg-secondary/30 transition-colors cursor-pointer w-full overflow-hidden",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-primary/40 hover:bg-muted/40"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 rounded-md bg-secondary/70 flex items-center justify-center text-muted-foreground">
            <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground truncate">Max {maxSizeMB}MB per file</p>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-2 w-full overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border/50 bg-card p-2.5 space-y-2 ">
              <div className="flex items-center gap-3 max-w-full overflow-hidden">
                <div className="size-8 rounded-md bg-secondary/60 text-muted-foreground flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-foreground/90">{item.file.name.slice(0, 20)}...</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
                </div>

                {item.state === "success" && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-500 shrink-0" />
                )}
                {item.state === "error" && (
                  <HugeiconsIcon icon={Alert02Icon} className="size-4 text-destructive shrink-0" />
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => clearItem(item.id)}
                  className="text-muted-foreground shrink-0"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                </Button>
              </div>

              {(item.state === "uploading" || item.state === "success") && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        item.state === "success" ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {item.state === "success" ? "Uploaded" : `${item.progress}%`}
                  </p>
                </div>
              )}

              {item.state === "error" && item.error && (
                <p className="text-xs text-destructive">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
