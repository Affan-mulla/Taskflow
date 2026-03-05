import { useState } from "react";
import { toast } from "sonner";

import { updateWorkspaceLogo } from "@/db/workspace/workspace.update";

export function useWorkspaceLogoUpload() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistWorkspaceLogo = async (workspaceId: string, logoUrl: string) => {
    setSaving(true);
    setError(null);

    try {
      const result = await updateWorkspaceLogo(workspaceId, logoUrl);

      if (!result.success) {
        const message = result.error || "Failed to update workspace logo";
        setError(message);
        toast.error("Could not update workspace logo", { description: message });
        return { success: false, error: message };
      }

      toast.success("Workspace logo updated");
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update workspace logo";
      setError(message);
      toast.error("Could not update workspace logo", { description: message });
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    persistWorkspaceLogo,
  };
}

export default useWorkspaceLogoUpload;
