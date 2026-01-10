import { isWorkspaceUrlUnique } from "@/db";
import { createSlugUrl } from "@/utils/createSlugUrl";
import { useState } from "react";

export const useIsUrlUnique = () => {
  const [loading, setLoading] = useState(false);
  const [unique, setUnique] = useState<boolean | null>(null);

  const isUrlUnique = async (url: string): Promise<void> => {
    // Don't check empty strings
    if (!url || url.trim() === '') {
      setUnique(null);
      return;
    }

    try {
      setLoading(true);
      const slugifiedUrl = createSlugUrl(url);
      const isUnique = await isWorkspaceUrlUnique(slugifiedUrl);
      setUnique(isUnique);
    } catch (error) {
      console.error('Error checking URL uniqueness:', error);
      setUnique(null);
    } finally {
      setLoading(false);
    }
  };

  return { loading, isUrlUnique, unique };
};
