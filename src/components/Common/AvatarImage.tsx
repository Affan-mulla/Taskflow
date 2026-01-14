import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarImgProps {
  src?: string;
  alt: string;
  fallbackClassName?: string;
}

const AvatarImg = ({ src, alt, fallbackClassName }: AvatarImgProps) => {
  const FallbackName = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  
  return (
    <Avatar className="rounded-lg size-full">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className={fallbackClassName || "rounded-lg w-full h-full bg-primary text-foreground text-xs flex items-center justify-center"}>
        {FallbackName}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;