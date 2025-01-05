"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./components/membersTable/columns";
import { DataTable } from "./components/membersTable/data-table";
import { useReadContract } from "wagmi";
import config from "@/constants/config.json";
import { Circle } from "@/types";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export default function Console() {
  const [totalUniqueMembers, setTotalUniqueMembers] = useState<number>(0);
  const [totalActiveCycles, setTotalActiveCycles] = useState<number>(0);

  const {
    data: circles,
    refetch: refetchCircles,
  }: { data: Circle[] | undefined; refetch: () => void } = useReadContract({
    abi: config.lens.savr.abi, // Contract ABI to interact with the smart contract
    address: config.lens.savr.address as `0x${string}`, // Contract address
    functionName: "getGroups",
    args: [1, "0x0000000000000000000000000000000000000000"],
  });
  const { data: volume }: { data: bigint | undefined } = useReadContract({
    abi: config.lens.savr.abi, // Contract ABI to interact with the smart contract
    address: config.lens.savr.address as `0x${string}`, // Contract address
    functionName: "totalVolume",
  });

  // Function to get active cycles across all circles
  const getActiveCyclesCount = (circles: Circle[]): number => {
    const currentTimestamp = BigInt(Date.now()); // Current timestamp in milliseconds as BigInt

    // Count active cycles across all circles
    let activeCycleCount = 0;

    circles.forEach((circle) => {
      circle.cycles.forEach((cycle) => {
        // Convert cycle's deadline from seconds to milliseconds
        const deadlineInMilliseconds = BigInt(cycle.deadline) * BigInt(1000);
        const createdAtInMilliseconds = BigInt(cycle.createdAt) * BigInt(1000);

        // Check if current time is between createdAt and deadline (active cycle)
        if (
          createdAtInMilliseconds <= currentTimestamp &&
          currentTimestamp <= deadlineInMilliseconds
        ) {
          activeCycleCount += 1;
        }
      });
    });

    return activeCycleCount; // Return the count of active cycles
  };

  // Function to get total unique members across all circles
  const getTotalUniqueMembers = (circles: Circle[]): number => {
    const uniqueMembers = new Set<string>(); // A set to store unique members

    circles.forEach((circle) => {
      uniqueMembers.add(circle.admin); // Add admin to the unique members set

      circle.members.forEach((member) => {
        uniqueMembers.add(member); // Add members to the set (duplicates are automatically handled)
      });
    });

    return uniqueMembers.size; // Return the count of unique members
  };

  useEffect(() => {
    // Set up the interval to call refetchCircles every 3 seconds
    const interval = setInterval(() => {
      refetchCircles();
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures it runs only once on mount

  // const transformCircleData = (circles?: Circle[]): any[] => {
  //   // Check if circles is undefined or empty
  //   if (!circles || circles.length === 0) {
  //     return []; // Return an empty array if no circles are provided
  //   }

  //   return circles.map((circle) => ({
  //     id: circle.id,
  //     name: circle.name,
  //     admin: circle.admin,
  //     contributionAmount: circle.contributionAmount.toString(), // Convert BigInt to string
  //     preStakeAmount: circle.preStakeAmount.toString(),
  //     totalCycles: circle.totalCycles.toString(),
  //     currentCycle: circle.currentCycle.toString(),
  //     currentRecipient: circle.currentRecipient,
  //     createdAt: new Date(Number(circle.createdAt) * 1000).toLocaleString(), // Convert from seconds to a human-readable date
  //     cycles: circle.cycles.length, // Just the number of cycles
  //     members: circle.members.join(", "), // Join members into a string
  //     image: circle.image,
  //   }));
  // };

  useEffect(() => {
    // Check total unique members and total active cycles when selectedCircle changes
    if (circles && circles.length > 0) {
      const uniqueMembers = getTotalUniqueMembers(circles);
      const activeCycles = getActiveCyclesCount(circles);

      setTotalUniqueMembers(uniqueMembers); // Set the state with total unique members
      setTotalActiveCycles(activeCycles); // Set the state with total active cycles
    }
  }, [circles]); // Run this effect when selectedCircle changes

  console.log(circles);
  return (
    <main className="h-full flex flex-col overflow-y-auto relative  ">
      {/* summary  */}
      <section className="grid xl:h-[18%]  gap-4 md:grid-cols-2 lg:grid-cols-4 py-6">
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
            <div className="text-2xl font-bold">
              ${volume && formatEther(volume)}
            </div>
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
            <div className="text-2xl font-bold">
              +{circles ? circles.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total circles created.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Users
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
            <div className="text-2xl font-bold">+{totalUniqueMembers}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Active Cycle
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
            <div className="text-2xl font-bold">{totalActiveCycles}</div>
            <p className="text-xs text-muted-foreground">As at now.</p>
          </CardContent>
        </Card>
      </section>
      {/* additional data */}
      {/* <section className="h-[100vh] xl:h-[82%] flex  gap-10 px-3 w-full overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </section> */}

      <section className="h-auto xl:h-[82%]   flex flex-col xl:flex-row gap-10">
        <DataTable columns={columns} data={circles || []} />
      </section>
    </main>
  );
}
