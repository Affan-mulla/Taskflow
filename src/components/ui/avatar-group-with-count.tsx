import AvatarImg from "../Common/AvatarImage";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./avatar";

interface AvatarProps {
  avatarUrls: string[];
  maxCount?: number;
}

function AvatarGroupWithCount({ avatarUrls, maxCount }: AvatarProps) {
  return (
    <AvatarGroup>
      {avatarUrls &&
        avatarUrls
          .map((url, index) => (
            <div key={index} className="size-4.5">
              <AvatarImg src={url} fallbackText={`Avatar ${index + 1}`} />
            </div>
          ))
          .slice(0, maxCount)}

      {
        avatarUrls.length > (maxCount || 3) && (
          <AvatarGroupCount className="size-5 text-xs  border-border border p-0 rounded-lg ring-0 ">
            +{avatarUrls.length - (maxCount || 3)}
          </AvatarGroupCount>
        )
      }
    </AvatarGroup>
  );
}

export default AvatarGroupWithCount;