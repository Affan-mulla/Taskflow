import { useState } from "react";
import { toast } from "sonner";

import { updateUserAvatarById } from "@/db/users/users.update";

export function useAvatarUpload() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistAvatar = async (userId: string, avatarUrl: string) => {
    setSaving(true);
    setError(null);

    try {
      const result = await updateUserAvatarById(userId, avatarUrl);

      if (!result.success) {
        const message = result.error || "Failed to update profile avatar";
        setError(message);
        toast.error("Could not update avatar", { description: message });
        return { success: false, error: message };
      }

      toast.success("Avatar updated");
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile avatar";
      setError(message);
      toast.error("Could not update avatar", { description: message });
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    persistAvatar,
  };
}

export default useAvatarUpload;
