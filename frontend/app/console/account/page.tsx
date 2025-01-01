"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileImage from "./components/ProfileImage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { Circle } from "@/types";
import config from "@/constants/config.json";
import { useEffect, useState } from "react";
import CircelCard from "../components/CircleCard";
import { Suspense } from "react";

export default function Account() {
  const searchParams = useSearchParams();
  const address = searchParams?.get("address") || useAccount().address;

  const [circlesByAdmin, setCirclesByAdmin] = useState<Circle[]>([]);
  const [totalMemberCycles, setTotalMemberCycles] = useState<number>(0);

  const { data: circles }: { data: Circle[] | undefined } = useReadContract({
    abi: config.savr.abi, // Contract ABI to interact with the smart contract
    address: config.savr.address as `0x${string}`, // Contract address
    functionName: "getGroups",
    args: [1, "0x0000000000000000000000000000000000000000"],
  });

  // Function to calculate all circles with a particular admin
  const getCirclesByAdmin = (
    circles: Circle[],
    adminAddress: string,
  ): Circle[] => {
    return circles.filter(
      (circle) => circle.admin.toLowerCase() === adminAddress.toLowerCase(),
    );
  };

  // Function to count total cycles for a particular address
  const countCyclesByMemberAddress = (
    circles: Circle[],
    address: string,
  ): number => {
    let totalCycles = 0;

    circles.forEach((circle) => {
      circle.cycles.forEach((cycle) => {
        if (cycle.members.includes(address.toLowerCase())) {
          totalCycles += 1;
        }
      });
    });

    return totalCycles;
  };

  useEffect(() => {
    if (!address || !circles) return;
    // Get circles for a specific admin
    const circlesWithAdmin = getCirclesByAdmin(circles, address);
    setCirclesByAdmin(circlesWithAdmin);

    // Count cycles for a specific member address
    const memberCycleCount = countCyclesByMemberAddress(circles, address);
    setTotalMemberCycles(memberCycleCount);
  }, [circles]);

  return (
    <main className="h-full flex flex-col gap-6 overflow-y-auto  ">
      {/* Profile */}

      <section className=" flex flex-col xl:flex-row xl:h-[20%] gap-4 pt-6">
        <div className=" w-full xl:w-[15%] ">
          <ProfileImage src="/profile.jpg" alt="profile image" />
        </div>
        <div className=" w-full xl:w-[85%]">
          <div className=" xl:h-[50%] flex items-center">
            <h2 className="font-bold text-xl">William Ikeji</h2>
          </div>

          <div className=" xl:h-[50%] flex flex-col xl:flex-row xl:gap-10 xl:items-center gap-4 items-start pt-6 xl:pt-0">
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Username</div>
              <div className=" text-lg">@Codypharm</div>
            </div>
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Wallet</div>
              <div className=" text-lg">0x0e6a....u81h9</div>
            </div>
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Email</div>
              <div className=" text-lg">williamikeji@gmail.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* summary  */}
      <section className="grid xl:h-[18%]  gap-4 md:grid-cols-2 lg:grid-cols-3 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Transactions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              Accumulated transactions.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Circles
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{circlesByAdmin.length}</div>
            <p className="text-xs text-muted-foreground">
              Total circles created.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total cycles
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalMemberCycles}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users.
            </p>
          </CardContent>
        </Card>
      </section>

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

      {/*  data */}
      <section className=" xl:h-[54%] grid lg:grid-cols-2 xl:grid-cols-3  gap-4 pb-10 px-3 w-full xl:overflow-y-auto">
        {circlesByAdmin?.map((circle, index) => (
          <CircelCard circle={circle} key={index} />
        ))}
      </section>
    </main>
  );
}
