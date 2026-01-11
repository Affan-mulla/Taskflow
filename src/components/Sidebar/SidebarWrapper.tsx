"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarRail,
} from "@/components/ui/sidebar"
import UserDropdown from "./TeamSwitcher"
import { Separator } from "../ui/separator"
import { NavMain } from "./NavMain"
import NavProjects from "./NavProjects"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar  {...props}>
      <SidebarHeader>
        <UserDropdown />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
