import { useEffect, useState } from "react";

export const useDebounce = (value: string) => {
  const [debounce, setDebounce] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(value);
    }, 500);

    return () => clearTimeout(handler);
  }, [value]);

  return { debounce };
};