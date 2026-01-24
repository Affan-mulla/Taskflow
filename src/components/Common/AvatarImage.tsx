import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarImgProps {
  src?: string;
  fallbackText: string;
  variant?: "initials" | "workspace";
}

const AvatarImg = ({ src, fallbackText, variant = "initials" }: AvatarImgProps) => {
  const baseInitials = fallbackText
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const FallbackName = variant === "workspace" ? baseInitials.slice(0, 2) : baseInitials;
  const fallbackClasses = cn(
    "rounded w-full h-full text-sm flex items-center justify-center hover:text-white",
    "bg-primary text-white",
    variant !== "workspace" && "text-xs"
  );
  
  return (
    <Avatar className="rounded-lg size-full">
      <AvatarImage src={src} />
      <AvatarFallback className={fallbackClasses}>
        {FallbackName}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;