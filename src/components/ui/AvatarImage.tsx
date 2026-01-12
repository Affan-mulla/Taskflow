import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const AvatarImg = ({ src, alt }: { src: string; alt: string }) => {
  const FallbackName = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
   <Avatar className=" rounded-lg size-fit">
    <AvatarImage src={src} alt={alt} />
    <AvatarFallback className="rounded-lg size-8 bg-primary text-foreground">{FallbackName}</AvatarFallback>
  </Avatar>
)
};

export default AvatarImg;