import {
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

const Team = () => {
  return (
    <div className="h-full w-full rounded-xl py-8 bg-card/30 ">
      <div className="p-8">
        <h1 className="font-semibold text-xl">Team Members</h1>
        <div className="flex justify-between items-center mt-6">
          <div className="w-full">
            <InputGroup className="max-w-xs">
              <InputGroupInput placeholder="Search by email or name." />
              <InputGroupAddon>
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="size-4 text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <InviteMembersItem />
        </div>
      </div>
      <div>
        <MembersList/>
      </div>
    </div>
  );
};



export default Team;
