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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Splash from "@/components/Splash";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If the user is not connected, redirect to the connection page or login
    if (!isConnected && !isConnecting && !isReconnecting) {
      router.push("/"); // Redirect to connection page
    }
  }, [isConnected, isConnecting, isReconnecting, router]);

  // If still connecting or reconnecting, display a loading message

  if (isConnected) {
    return (
      <div className="h-screen">
        <SidebarProvider className="h-screen">
          <AppSidebar />
          <SidebarInset className="h-full">
            <header className="flex h-[10%] xl:h-[5%] shrink-0 items-center gap-2 border-b px-4 bg-white">
              <SidebarTrigger className="-ml-1 hidden xl:flex" />
              <div className="flex flex-grow items-center justify-between xl:justify-end">
                <Link
                  href="/"
                  className="font-bold text-3xl flex items-center xl:hidden  h-16"
                >
                  Savr
                </Link>
                <ConnectKitButton />
              </div>
            </header>
            <div className="flex h-[90%] xl:h-[95%] flex-col  px-3 bg-white">
              <div className="flex items-center h-[2%] ">
                <SidebarTrigger className="-ml-1 xl:hidden" />

                <Breadcrumb>
                  <BreadcrumbList className="py-2">
                    {currentPath == "/console" && (
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/console">Console</BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                    {currentPath == "/console/circles" && (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="/console">
                            Console
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Circles</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                    {currentPath == "/console/account" && (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="/console">
                            Console
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Account</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Suspense fallback={<div>Loading...</div>}>
                <div className="h-[98%] ">{children}</div>
              </Suspense>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  return <Splash />;
}
