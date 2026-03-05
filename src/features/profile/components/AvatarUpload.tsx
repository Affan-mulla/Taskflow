import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { useAvatarUpload } from "@/features/profile/hooks/useAvatarUpload";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  displayName: string;
  onUpdated: (url: string) => void;
}

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

function isValidAvatar(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "Avatar must be 2MB or smaller";
  }

  return null;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  displayName,
  onUpdated,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { persistAvatar, saving } = useAvatarUpload();

  const inFlight = uploading || saving;
  const circleRadius = 27;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const processFile = async (file: File) => {
    const validationError = isValidAvatar(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const uploadResult = await uploadToCloudinary({
        file,
        folder: "avatars",
        onProgress: setProgress,
      });

      const saveResult = await persistAvatar(userId, uploadResult.secureUrl);

      if (!saveResult.success) {
        setError(saveResult.error || "Failed to save avatar");
        return;
      }

      setPreviewUrl(uploadResult.secureUrl);
      onUpdated(uploadResult.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
    event.target.value = "";
  };

  const handleDrop = async (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleInputChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        disabled={inFlight}
        className={cn(
          "relative size-16 rounded-full overflow-hidden border transition-all",
          dragOver ? "border-primary ring-2 ring-primary/20" : "border-border/60",
          inFlight && "opacity-90"
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={displayName} className="size-full object-cover" />
        ) : (
          <div className="size-full bg-secondary text-foreground/80 text-sm font-medium grid place-items-center">
            {getInitials(displayName)}
          </div>
        )}

        {!inFlight && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors grid place-items-center">
            <span className="opacity-0 hover:opacity-100 text-white text-[10px] flex items-center gap-1">
              <HugeiconsIcon icon={Add01Icon} className="size-3" />
              Upload
            </span>
          </div>
        )}

        {inFlight && (
          <div className="absolute inset-0 bg-black/55 grid place-items-center">
            <svg className="size-full absolute inset-0 -rotate-90" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r={circleRadius} stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle
                cx="32"
                cy="32"
                r={circleRadius}
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <span className="text-white text-xs font-medium">{progress}%</span>
          </div>
        )}
      </button>

      <p className="text-xs text-muted-foreground">Drop an image or click to upload (max 2MB)</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && !inFlight && <p className="text-xs text-emerald-600 dark:text-emerald-400">Ready</p>}
    </div>
  );
}

export default AvatarUpload;
