import { Outlet } from "react-router";
import SettingSidebar from "../components/SettingSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarInset>
        <SettingSidebar />

      <ScrollArea className=" h-full overflow-auto">
        <main className="w-full">
            <Outlet />
        </main>
        </ScrollArea>
      </SidebarInset>
    </div>
  );
};

export default Settings;
