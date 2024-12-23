import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: MdOutlineSpaceDashboard,
  },

  {
    title: "Circles",
    url: "#",
    icon: RiUserCommunityLine,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="font-bold text-3xl flex items-center px-4  h-16">
          Savr
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>footer</SidebarFooter>
    </Sidebar>
  );
}
