"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ConnectKitButton } from "connectkit";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <SidebarProvider className="h-screen">
        <AppSidebar />
        <SidebarInset className="h-full">
          <header className="flex h-[5%] shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />

            <div className="flex flex-grow items-center justify-end">
              <ConnectKitButton />
            </div>
          </header>
          <div className="flex h-[95%] flex-col gap-4 px-3 bg-white">
            <Breadcrumb>
              <BreadcrumbList className="py-2">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Console</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Circles</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
