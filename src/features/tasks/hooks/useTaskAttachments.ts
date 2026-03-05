import { useState } from "react";
import { toast } from "sonner";

import { updateTaskAttachmentsById } from "@/db/tasks/tasks.update";
import type { CloudinaryUploadResult } from "@/lib/cloudinary";

export function useTaskAttachments() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTaskAttachments = async (taskId: string, attachments: CloudinaryUploadResult[]) => {
    setSaving(true);
    setError(null);

    try {
      await updateTaskAttachmentsById(
        taskId,
        attachments.map((attachment) => ({
          title:
            attachment.originalFilename ||
            attachment.publicId.split("/").pop() ||
            "Attachment",
          url: attachment.secureUrl,
        }))
      );

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save task attachments";
      setError(message);
      toast.error("Could not save attachments", { description: message });
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    saveTaskAttachments,
  };
}

export default useTaskAttachments;
