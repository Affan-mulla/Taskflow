import { useRef, useState, type ChangeEvent } from "react";

import { Spinner } from "@/components/ui/spinner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { useWorkspaceLogoUpload } from "@/features/workspace/hooks/useWorkspaceLogoUpload";

interface WorkspaceLogoUploadProps {
  workspaceId: string;
  currentLogoUrl?: string;
  workspaceName: string;
  onUpdated: (url: string) => void;
}

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function getWorkspaceInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "W";
}

export function WorkspaceLogoUpload({
  workspaceId,
  currentLogoUrl,
  workspaceName,
  onUpdated,
}: WorkspaceLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { persistWorkspaceLogo, saving } = useWorkspaceLogoUpload();
  const inFlight = uploading || saving;

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("Logo must be 2MB or smaller");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploadResult = await uploadToCloudinary({
        file,
        folder: "workspace-logos",
      });

      const saveResult = await persistWorkspaceLogo(workspaceId, uploadResult.secureUrl);

      if (!saveResult.success) {
        setError(saveResult.error || "Failed to save workspace logo");
        return;
      }

      setPreviewUrl(uploadResult.secureUrl);
      onUpdated(uploadResult.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload workspace logo");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleUpload(file);
    event.target.value = "";
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
        disabled={inFlight}
        className={cn(
          "relative size-16 rounded-xl border border-border/60 overflow-hidden",
          "hover:border-primary/50 transition-colors"
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={workspaceName} className="h-full w-full object-cover" />
        ) : (
          <div className="size-full bg-secondary text-foreground/80 text-lg font-semibold grid place-items-center">
            {getWorkspaceInitial(workspaceName)}
          </div>
        )}

        {inFlight && (
          <div className="absolute inset-0 bg-black/45 grid place-items-center">
            <Spinner className="size-5 text-white" />
          </div>
        )}
      </button>

      <p className="text-xs text-muted-foreground">Click logo to upload (images only, max 2MB)</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && !inFlight && <p className="text-xs text-emerald-600 dark:text-emerald-400">Ready</p>}
    </div>
  );
}

export default WorkspaceLogoUpload;
