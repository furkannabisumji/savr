import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react";
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
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Console",
    url: "/console",
    icon: MdOutlineSpaceDashboard,
  },

  {
    title: "Circles",
    url: "/console/circles",
    icon: RiUserCommunityLine,
  },
  {
    title: "Account",
    url: "#",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Link
          href="/"
          className="font-bold text-3xl flex items-center px-4  h-16"
        >
          Savr
        </Link>
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
