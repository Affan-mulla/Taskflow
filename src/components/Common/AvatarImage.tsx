import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarImgProps {
  src?: string;
  fallbackText: string;
  variant?: "initials" | "workspace";
  className?: string;
}

const AvatarImg = ({ src, fallbackText, variant = "initials" }: AvatarImgProps) => {
  const firstLetter = fallbackText.charAt(0).toUpperCase();
  
  // Workspace avatars show 2 letters, user avatars show 1 letter
  const FallbackName = variant === "workspace" 
    ? fallbackText.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : firstLetter;
    
  const fallbackClasses = cn(
    "rounded w-full h-full text-sm flex items-center justify-center hover:text-white",
    "bg-primary text-white",
    variant !== "workspace" && "text-xs"
  );
  
  return (
    <Avatar className={cn("rounded-lg size-full")}>
      <AvatarImage src={src} />
      <AvatarFallback className={fallbackClasses}>
        {FallbackName}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;