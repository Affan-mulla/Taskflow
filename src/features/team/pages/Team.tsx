import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search01Icon,
  Sent02Icon,
  UserGroupIcon,
  UserPlus,
  X,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
