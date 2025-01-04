"use client";

import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { WelcomeToSavr } from "@/components/WelcomeToSavr";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  return (
    <main className="h-screen">
      <nav className="h-[8%] flex justify-between items-center px-10 bg-white">
        <h2 className="font-bold text-xl">SAVR</h2>

        {/* <ConnectWalletButton /> */}
        <ConnectKitButton />
      </nav>
      <section className="h-[92%] grid xl:grid-cols-2">
        <div className="h-full flex flex-col justify-center items-center  ">
          <h2 className="font-semibold text-sm">
            PEER-TO-PEER SAVINGS & LENDING
          </h2>
          <h1 className="font-bold text-xl xl:text-7xl py-2 text-center">
            Decentralized ROSCA Platform
          </h1>
          <p className="text-sm flex items-center gap-2">
            <Image
              src="/lens.jpg"
              alt="lens logo"
              priority={true}
              width={50}
              height={50}
              className="rounded-full"
            />
            Powered by Lens Protocol.
          </p>

          {!isConnected && !isConnecting && !isReconnecting ? (
            <ConnectKitButton />
          ) : isConnected ? (
            <Link
              href="/console"
              className={`${buttonVariants({ variant: "secondary" })} bg-primary mt-3 rounded-full w-44`}
            >
              Get started
            </Link>
          ) : null}
        </div>
        <div className="h-full hidden xl:flex flex-col justify-center items-center bg-zinc-100  ">
          <WelcomeToSavr />
        </div>
      </section>
    </main>
  );
}
