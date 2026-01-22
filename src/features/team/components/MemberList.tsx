
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";
type SortKey = "userName" | "email" | "role" | "joinedAt";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const MembersList = () => {
  const { members, membersLoading } = useWorkspaceStore();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "userName",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      if (sortConfig.key === "joinedAt") {
         // Handle Firestore Timestamp or serialized date
         const dateA =  (a.joinedAt as any)?.seconds ? new Date((a.joinedAt as any).seconds * 1000) : new Date(a.joinedAt as any);
         const dateB = (b.joinedAt as any)?.seconds ? new Date((b.joinedAt as any).seconds * 1000) : new Date(b.joinedAt as any);
         return sortConfig.direction === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [members, sortConfig]);

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
    if (!active) return null;
    return (
      <HugeiconsIcon
        icon={direction === "asc" ? ArrowDown01Icon : ArrowUp01Icon}
        className="size-3.5 ml-1.5 text-muted-foreground/70"
        strokeWidth={2.5}
      />
    );
  };

  const HeaderButton = ({ label, sortKey, className }: { label: string; sortKey: SortKey; className?: string }) => (
    <div
      className={cn(
        "flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors select-none py-1",
        className
      )}
      onClick={() => handleSort(sortKey)}
    >
      {label}
      <SortIcon
        active={sortConfig.key === sortKey}
        direction={sortConfig.direction}
      />
    </div>
  );

  if (membersLoading) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Loading members...</div>;
  }

  if (members.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">No members found.</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-[3fr_2.5fr_1fr_1.5fr_1.5fr] border-b border-border/40 px-6 py-1 bg-accent">
        <HeaderButton label="Name" sortKey="userName" />
        <HeaderButton label="Email" sortKey="email" />
        <HeaderButton label="Role" sortKey="role" />
        <HeaderButton label="Joined" sortKey="joinedAt" />
        <div className="flex items-center text-xs font-medium text-muted-foreground py-1 cursor-pointer hover:text-foreground transition-colors">
          Last Active
        </div>
      </div>

      <div className="flex flex-col">
        {sortedMembers.map((member) => {
          // Robust date handling
          let joinedDate: Date | null = null;
          try {
             if((member.joinedAt as any)?.seconds) {
                 joinedDate = new Date((member.joinedAt as any).seconds * 1000);
             } else if (member.joinedAt) {
                 joinedDate = new Date(member.joinedAt as any);
             }
          } catch (e) {
             console.error("Date parse error", e);
          }

          return (
            <div
              key={member.userId}
              className="grid grid-cols-[3fr_2.5fr_1fr_1.5fr_1.5fr] items-center px-6 py-3 border-b border-border/40 hover:bg-muted/30 transition-colors group cursor-default text-sm"
            >
              <div className="flex items-center gap-3 pr-4">
                <Avatar className="size-6 text-[10px]">
                  <AvatarImage src={member.avatarUrl} alt={member.userName} />
                  <AvatarFallback>{member.userName?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate text-foreground/90">{member.userName}</span>
              </div>
              
              <div className="truncate text-muted-foreground pr-4">
                {member.email}
              </div>

              <div className="pr-4">
                 <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize",
                    member.role === 'owner' ? "bg-primary/10 text-primary" : 
                    member.role === 'admin' ? "bg-primary/50 text-primary" :
                    "bg-muted text-muted-foreground"
                 )}>
                    {member.role}
                 </span>
              </div>

              <div className="text-muted-foreground/80 pr-4">
                {joinedDate ? format(joinedDate, "MMM d, yyyy") : "-"}
              </div>

              <div className="text-muted-foreground/60">
                 {/* Placeholder for Last Active as it's not in the store yet */}
                 -
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersList;