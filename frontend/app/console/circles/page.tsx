"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import { CiMoneyCheck1 } from "react-icons/ci";
import Link from "next/link";

export default function Circles() {
  return (
    <main className="h-[90%] flex flex-col gap-6 ">
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

      <div className="h-[87%] grid lg:grid-cols-2 xl:grid-cols-3  w-full overflow-y-auto gap-4 px-3 bg-gray-50 py-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Link href={`/console/circles/${index}`} key={index}>
            <Card className="col-span-1 h-[200px] py-2 px-2 rounded-md cursor-pointer">
              <CardContent className=" h-full flex pb-0 px-0 gap-3">
                <div className="bg-gray-300 w-[30%] h-full rounded-md"></div>
                <div className="flex flex-grow flex-col ">
                  <div className="flex justify-between items-center  h-[20%] border-b">
                    <h3 className="font-semibold text-sm ">Web 3 Legends</h3>
                    <small className="text-gray-500">2 months ago</small>
                  </div>
                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <PiRecycle size={15} /> <span>Cycles:</span>
                    </h3>
                    <small className="text-gray-500">20.0</small>
                  </div>
                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiUsersThreeBold size={15} /> <span>Members:</span>{" "}
                    </h3>
                    <small className="text-gray-500">1.2k</small>
                  </div>

                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiMoney size={15} /> <span>Contributions:</span>
                    </h3>
                    <small className="text-gray-500">20</small>
                  </div>

                  <div className="flex justify-end items-center h-[20%] border-t pt-2">
                    <Button className="rounded-none py-2 w-[30%] ">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
