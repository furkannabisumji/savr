"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function Home() {
  return (
    <main className="h-screen">
      <nav className="h-[8%] flex justify-between items-center px-10 bg-white">
        <h2 className="font-bold text-xl">SAVR</h2>

        <ConnectKitButton />
      </nav>
      <section className="h-[92%] grid grid-cols-2">
        <div className="h-full flex flex-col justify-center items-center  ">
          <h2 className="font-semibold text-sm">
            PEER-TO-PEER SAVINGS & LENDING
          </h2>
          <h1 className="font-bold text-7xl py-2 text-center">
            Decentralized ROSCA Platform
          </h1>
          <p className="text-sm">Powered by Lens Protocol.</p>

          <Link
            href="/console"
            className={
              buttonVariants({ variant: "outline" }) +
              "bg-primary mt-3 rounded-full w-44"
            }
          >
            Get started
          </Link>
        </div>
        <div className="h-full flex flex-col justify-center items-center bg-zinc-100  ">
          <div className="bg-white rounded-xl h-80 w-72 p-7">
            <div className="h-full rounded-xl w-full bg-green-200 flex items-center justify-center">
              <FaUser size={200} className="text-green-500" />
            </div>
          </div>

          <div className=" w-full max-w-sm items-center  flex flex-col gap-2 py-5">
            <Input
              type="text"
              placeholder="Choose username"
              className="bg-background h-12 outline-none "
            />
            <Button type="submit" className="w-full h-12 font-semibold">
              Mint
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
