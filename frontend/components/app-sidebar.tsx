import { BadgeCheck, Bell, ChevronsUpDown, LogOut, User } from "lucide-react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { useAccount } from "wagmi";
import WalletAddress from "@/app/console/components/WalletAddress";
import WalletAvatar from "@/app/console/circles/[slug]/components/WalletAvatar";

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
    url: "/console/account",
    icon: User,
  },
];

export function AppSidebar() {
  const currentPath = usePathname();
  const { address } = useAccount();
  return (
    <Sidebar>
      <SidebarContent>
        <Link
          href="/"
          className="font-bold text-3xl flex items-center px-4  h-16"
        >
          <Image src="/logo.png" alt="savr logo" width={100} height={100} />
        </Link>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  currentPath === item.url || // Exact match
                  (currentPath.startsWith(item.url + "/") &&
                    item.url !== "/console"); // Match sub-paths but exclude unintended highlights

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={isActive ? "bg-secondary" : ""}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                >
                  {/* <Avatar>
                    <AvatarImage src="/profile.jpg" />
                    <AvatarFallback>WA</AvatarFallback>
                  </Avatar> */}
                  {address && <WalletAvatar walletAddress={address} />}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {address && <WalletAddress address={address} />}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    {address && <WalletAvatar walletAddress={address} />}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {address && <WalletAddress address={address} />}
                      </span>
                      <span className="truncate text-xs">
                        {/* williamikeji@gmail.com */}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link href="/console/account">
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
