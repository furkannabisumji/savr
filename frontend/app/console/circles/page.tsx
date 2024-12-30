"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useReadContract } from "wagmi";
import config from "@/constants/config.json";
import type { Circle } from "@/types";
import CircelCard from "../components/CircleCard";

export default function Circles() {
  const { data: circles }: { data: Circle[] | undefined } = useReadContract({
    abi: config.savr.abi, // Contract ABI to interact with the smart contract
    address: config.savr.address as `0x${string}`, // Contract address
    functionName: "getGroups",
  });

  console.log(circles);

  return (
    <main className="h-full flex flex-col gap-6 ">
      <div className="relative h-18   w-full max-w-2xl m-auto flex gap-3 p-2 bg-background/40 backdrop-blur-md rounded-xl border border-border/40 shadow-md">
        <Input
          type="text"
          placeholder="Search circles..."
          className="h-12 flex-1 bg-background/60 border-border/30 rounded-lg
                           text-foreground placeholder:text-muted-foreground
                           focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                           hover:bg-background/80 hover:border-primary/50
                           hover:shadow-[0_0_15px_rgba(5,10,48,0.25)]
                           transition-all duration-300"
        />
        <Button
          type="submit"
          variant="secondary"
          className="h-12 px-8 border border-primary
                             hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(5,10,48,0.5)]
                             shadow-md transition-all duration-300
                             hover:scale-105 active:scale-95"
        >
          <span className="mr-2">Search</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
      </div>

      <div className="flex justify-between h-[8%] items-center border-b py-2 px-2">
        <div className="bg-white ">
          <Select defaultValue="all">
            <SelectTrigger className="w-[100px]  border-border/40 bg-background/50 backdrop-blur">
              Filter
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all" className="cursor-pointer">
                  All
                </SelectItem>
                <SelectItem value="mine" className="cursor-pointer">
                  My Circles
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white">
          <Select defaultValue="date">
            <SelectTrigger className="w-[180px] border-border/40 bg-background/50 backdrop-blur">
              Sort By
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest" className="cursor-pointer">
                  Latest
                </SelectItem>
                <SelectItem value="value" className="cursor-pointer">
                  Value
                </SelectItem>
                <SelectItem value="members" className="cursor-pointer">
                  Members
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[87%] grid lg:grid-cols-2 xl:grid-cols-3  w-full overflow-y-auto gap-4 px-3 bg-gray-50 py-2 ">
        {circles?.map((circle, index) => (
          <CircelCard circle={circle} key={index} />
        ))}
      </div>
    </main>
  );
}
