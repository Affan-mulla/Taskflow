import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/ui/FileUpload";
import type { CloudinaryUploadResult } from "@/lib/cloudinary";
import { useTaskAttachments } from "@/features/tasks/hooks/useTaskAttachments";

interface TaskAttachmentsProps {
  taskId: string;
  attachments: CloudinaryUploadResult[];
  onChange: (attachments: CloudinaryUploadResult[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageAttachment(attachment: CloudinaryUploadResult): boolean {
  return attachment.resourceType === "image";
}

export function TaskAttachments({ taskId, attachments, onChange }: TaskAttachmentsProps) {
  const { saveTaskAttachments, saving, error } = useTaskAttachments();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const sortedAttachments = useMemo(
    () => [...attachments].reverse(),
    [attachments]
  );

  const syncAttachments = async (nextAttachments: CloudinaryUploadResult[]) => {
    onChange(nextAttachments);

    if (!taskId?.trim()) return;
    await saveTaskAttachments(taskId, nextAttachments);
  };

  const handleUploadComplete = async (results: CloudinaryUploadResult[]) => {
    setUploadError(null);
    const next = [...attachments, ...results];
    await syncAttachments(next);
  };

  const handleRemove = async (publicId: string) => {
    const next = attachments.filter((attachment) => attachment.publicId !== publicId);
    await syncAttachments(next);
  };

  return (
    <Card className="p-4 space-y-4 border-border/50">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground/90">Attachments</h3>
        <p className="text-xs text-muted-foreground">
          Upload images and files (pdf, doc, zip, csv, txt)
        </p>
      </div>

      <FileUpload
        folder="task-attachments"
        multiple
        maxSizeMB={15}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv"
        onUploadComplete={handleUploadComplete}
        onError={setUploadError}
      />

      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedAttachments.map((attachment) => {
            const isImage = isImageAttachment(attachment);

            return (
              <div
                key={attachment.publicId}
                className="rounded-lg border border-border/50 bg-card/50 overflow-hidden"
              >
                {isImage ? (
                  <div className="relative aspect-video bg-secondary/40">
                    <img
                      src={attachment.secureUrl}
                      alt={attachment.originalFilename || "Attachment"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 px-3 flex items-center gap-3 bg-secondary/30">
                    <div className="size-9 rounded-md bg-secondary/70 text-muted-foreground grid place-items-center">
                      <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90 truncate">
                        {attachment.originalFilename || "Attachment"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.bytes)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {attachment.originalFilename || attachment.publicId.split("/").pop()}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(attachment.publicId)}
                    disabled={saving}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="min-h-4">
        {saving && <p className="text-xs text-muted-foreground">Saving attachments…</p>}
        {!saving && uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
        {!saving && error && <p className="text-xs text-destructive">{error}</p>}
        {!saving && !error && !uploadError && attachments.length > 0 && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Attachments synced
          </p>
        )}
      </div>
    </Card>
  );
}

export default TaskAttachments;
