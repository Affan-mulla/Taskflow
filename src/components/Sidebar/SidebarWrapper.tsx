"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import UserDropdown from "./TeamSwitcher"
import { Separator } from "../ui/separator"
import { NavMain } from "./NavMain"
import NavProjects from "./NavProjects"
import { useUserStore } from "@/shared/store/store.user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user, loading} = useUserStore()
  console.log("Sidebar User:", user, "Loading:", loading);
  
  return (
    <Sidebar  {...props}>
      <SidebarHeader>
        
         {
          user && !loading && (
              <UserDropdown userName={user?.name} avatar={user?.avatar} />
          )
         }
      
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
    </Sidebar>
  )
}
