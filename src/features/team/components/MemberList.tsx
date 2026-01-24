
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import AvatarImg from "@/components/Common/AvatarImage";

type SortDirection = "asc" | "desc";
type SortKey = "userName" | "email" | "role" | "joinedAt";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface MembersListProps {
  searchQuery?: string;
}

const MembersList = ({ searchQuery = "" }: MembersListProps) => {
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

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter((member) => {
      const nameMatch = member.userName?.toLowerCase().includes(query);
      const emailMatch = member.email?.toLowerCase().includes(query);
      return nameMatch || emailMatch;
    });
  }, [members, searchQuery]);

  // Sort filtered members
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
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
  }, [filteredMembers, sortConfig]);

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
        "flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors select-none py-2",
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

  if (sortedMembers.length === 0 && searchQuery) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        No members found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[3fr_2.5fr_1fr_1.5fr_1.5fr] border-b border-border/40 px-6 bg-muted/20">
        <HeaderButton label="Name" sortKey="userName" />
        <HeaderButton label="Email" sortKey="email" />
        <HeaderButton label="Role" sortKey="role" />
        <HeaderButton label="Joined" sortKey="joinedAt" />
        <div className="flex items-center text-xs font-medium text-muted-foreground py-2 cursor-pointer hover:text-foreground transition-colors">
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

          const formattedDate = joinedDate ? format(joinedDate, "MMM d, yyyy") : "-";

          return (
            <div
              key={member.userId}
              className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
            >
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-[3fr_2.5fr_1fr_1.5fr_1.5fr] items-center px-6 py-3 text-sm">
                    <div className="flex items-center gap-3 pr-4">
                        <div className="size-6">
                            <AvatarImg 
                                src={member.avatarUrl} 
                                fallbackText={member.userName || "??"} 
                            />
                        </div>
                        <span className="font-medium truncate text-foreground/90">{member.userName}</span>
                    </div>
                    
                    <div className="truncate text-muted-foreground pr-4">
                        {member.email}
                    </div>

                    <div className="pr-4">
                        <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize border",
                            member.role === 'admin' 
                              ? "bg-primary/20 text-primary border-primary/40" 
                              : "bg-muted/60 text-muted-foreground border-border/40"
                        )}>
                            {member.role}
                        </span>
                    </div>

                    <div className="text-muted-foreground/80 pr-4">
                        {formattedDate}
                    </div>

                    <div className="text-muted-foreground/60">
                        {/* Placeholder for Last Active */}
                        -
                    </div>
                </div>

                {/* Mobile Row */}
                <div className="flex md:hidden items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9">
                            <AvatarImg 
                                src={member.avatarUrl} 
                                fallbackText={member.userName || "??"} 
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate text-foreground">{member.userName}</span>
                            <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                         <span className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium capitalize border",
                            member.role === 'admin' 
                              ? "bg-primary/50 text-primary" 
                              : "bg-muted/60 text-muted-foreground border-border/40"
                        )}>
                            {member.role}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersList;