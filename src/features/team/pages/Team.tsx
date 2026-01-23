import {
  ArrowLeft,
  Search01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import MembersList from "../components/MemberList";
import InviteMembersItem from "../components/InviteMembers";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";

const Team = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  
  if (isMobile) {
    return <MobileTeamView />;
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Desktop Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border/40">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Team Members</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage who has access to this workspace.</p>
        </div>
        <InviteMembersItem />
      </header>
      
      {/* Toolbar */}
      <div className="px-8 py-4">
        <div className="w-full max-w-sm">
          <InputGroup className="h-9 w-full"> 
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="size-4 text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput 
              placeholder="Filter by name or email..." 
              className="text-sm h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <MembersList searchQuery={searchQuery} />
      </div>
    </div>
  );
};

const MobileTeamView = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const handleBack = () => navigate(-1);

    return (
        <div className="flex flex-col h-full bg-background">
            <nav className="flex items-center gap-2 p-4 border-b border-border/40 min-h-[60px]">
                <SidebarTrigger />
                 <Button variant={"ghost"} size={"icon"} onClick={handleBack} className="-ml-2">
                    <HugeiconsIcon icon={ArrowLeft} className="size-5" />
                </Button>
                <div className="flex-1">
                     <h1 className="font-semibold text-lg leading-none">Team</h1>
                </div>
                <InviteMembersItem />
            </nav>
            
            <div className="p-4 border-b border-border/40">
                 <InputGroup> 
                    <InputGroupAddon>
                    <HugeiconsIcon
                        icon={Search01Icon}
                        className="size-4 text-muted-foreground"
                    />
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="Search..." 
                      className="text-sm" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="flex-1 overflow-auto">
                 <MembersList searchQuery={searchQuery} />
            </div>
        </div>
    )
}

export default Team;
