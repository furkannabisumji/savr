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
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Splash from "@/components/Splash";
import { switchChain } from "@wagmi/core";
import { lens } from "../customChains";
import { walletClient } from "@/lib/viem";
import Image from "next/image";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();
  const router = useRouter();

  const [delayedCheck, setDelayedCheck] = useState(false);

  async function checkChain() {
    walletClient && (await walletClient.switchChain({ id: lens.id }));
  }

  useEffect(() => {
    // Set a delay to ensure states are stabilized
    checkChain();
    const timer = setTimeout(() => setDelayedCheck(true), 100); // Adjust delay as needed
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    // If the user is not connected, redirect to the connection page or login
    if (delayedCheck && !isConnected && !isConnecting && !isReconnecting) {
      router.push("/"); // Redirect to connection page
    }
  }, [
    isConnected,
    isConnecting,
    isReconnecting,
    delayedCheck,
    router,
    address,
  ]);

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
                  <Image
                    src="/logo.png"
                    alt="savr logo"
                    width={100}
                    height={100}
                  />
                </Link>
                <ConnectKitButton />
              </div>
            </header>
            <div className="flex h-[90%] xl:h-[95%] flex-col px-3 bg-white">
              <div className="flex items-center h-[2%]">
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
                <div className="h-[98%]">{children}</div>
              </Suspense>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  if (isConnecting || isReconnecting) {
    return <Splash />;
  }

  return null;
}
