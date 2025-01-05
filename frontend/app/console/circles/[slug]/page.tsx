"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activities } from "./components/Activities";
import { LuUsers } from "react-icons/lu";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { Chat } from "./components/Chat";
import { Members } from "./components/Members";
import { Terms } from "./components/Terms";
import { FaRegAddressCard } from "react-icons/fa";
import { Invites } from "./components/Invites";
import { Circle, CircleData, Cycle } from "@/types";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import config from "@/constants/config.json";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatEther, parseEther, parseUnits } from "viem";
import WalletAddress from "../../components/WalletAddress";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { InviteDataForm } from "./components/InviteForm";
import TimeAgo from "../../components/TimeToGo";
import JoinCircleButton from "../../components/JoinCircleButton";
import CountdownTimer from "../../components/CountDowntimer";
import { sepolia } from "viem/chains";
import { walletClient } from "@/lib/viem";
import { wagmiConfig } from "@/app/CustomLensProvider";
import { switchChain } from "@wagmi/core";
import { lens } from "@/app/customChains";

export default function CircleDetail() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const admin = searchParams.get("admin");
  const { toast } = useToast();
  const { writeContractAsync: contributeFunction } = useWriteContract();
  const [isContributing, setIsContributing] = useState(false);
  const { address } = useAccount();
  const [activeCycle, setActiveCycles] = useState<Cycle | null>(null);
  const [completedCycles, setCompletedCycles] = useState<Cycle[]>([]);
  const [activeCircle, setActiveCircle] = useState<Circle | null>(null);
  const { data: selectedCircle }: { data: Circle[] | undefined } =
    useReadContract({
      abi: config.lens.savr.abi, // Contract ABI to interact with the smart contract
      address: config.lens.savr.address as `0x${string}`, // Contract address
      functionName: "getGroups",
      args: [slug, admin],
    });

  console.log(selectedCircle);

  const { data: invites }: { data: string[] | undefined } = useReadContract({
    abi: config.lens.savr.abi, // Contract ABI to interact with the smart contract
    address: config.lens.savr.address as `0x${string}`, // Contract address
    functionName: "getInvitesAddresses",
    args: [slug],
  });
  const calculatePercentage = (x: number, A: number): number => {
    return (x / 100) * A;
  };

  const contribute = async () => {
    // Switch to the Sepolia chain
    await switchChain(wagmiConfig, { chainId: sepolia.id });

    const contributionAmount = activeCircle?.contributionAmount || 0;
    const activeCircleId = activeCircle?.id || 0;

    // Log the contribution amount in human-readable form
    console.log("Contribution Amount (in wei):", contributionAmount);

    // Convert the contribution amount to the token's smallest unit (6 decimals) since aave usdt has 6 as decimal
    const contributionAmountInSmallestUnit = parseUnits(
      formatEther(contributionAmount as bigint),
      6,
    ); // 6 decimals for the token
    console.log(
      "Contribution Amount (in smallest unit):",
      contributionAmountInSmallestUnit.toString(),
    );

    setIsContributing(true);

    try {
      // Approve the token for the pool contract
      await contributeFunction({
        abi: config.sepolia.usdt.abi,
        address: config.sepolia.usdt.address as `0x${string}`,
        functionName: "approve",
        args: [
          config.sepolia.savrpool.address,
          contributionAmountInSmallestUnit,
        ], // Send the converted value
      });

      // Execute the contribution transaction
      await contributeFunction({
        abi: config.sepolia.savrpool.abi,
        address: config.sepolia.savrpool.address as `0x${string}`,
        functionName: "supply",
        args: [activeCircleId, contributionAmountInSmallestUnit], // Send the converted value
      });

      // Show success toast
      toast({
        description: "Contribution completed successfully!",
      });
      setIsContributing(false);
    } catch (error) {
      // Show error toast if transaction fails
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Contribution failed.",
      });
    } finally {
      // Switch back the chain
      await switchChain(wagmiConfig, { chainId: lens.id });
      setIsContributing(false);
    }
  };

  // const contribute = async () => {
  //   setIsContributing(true);
  //   try {
  //     // Approve token for factory contract
  //     await contributeFunction({
  //       abi: config.lens.usdt.abi,
  //       address: config.lens.usdt.address as `0x${string}`,
  //       functionName: "approve",
  //       args: [
  //         config.lens.savr.address,
  //         selectedCircle ? selectedCircle[1].contributionAmount : 0,
  //       ],
  //     });

  //     // Execute the contribution transaction
  //     await contributeFunction({
  //       abi: config.lens.savr.abi,
  //       address: config.lens.savr.address as `0x${string}`,
  //       functionName: "contribute",
  //       args: [selectedCircle ? selectedCircle[1].id : 0],
  //     });

  //     // Show success toast
  //     toast({
  //       description: "Contribution completed successfully!",
  //     });
  //     setIsContributing(false);
  //   } catch (error) {
  //     // Show error toast if transaction fails
  //     console.log(error);
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: "Contribution failed.",
  //     });
  //   } finally {
  //     setIsContributing(false);
  //   }
  // };

  // Function to check active cycles
  const getActiveCycle = (selectedCircle: Circle): Cycle | null => {
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // Get current timestamp as BigInt

    // Find the active cycle: If the current timestamp is between createdAt and deadline
    const activeCycle = selectedCircle.cycles.find((cycle) => {
      const { createdAt, deadline } = cycle;
      return createdAt <= currentTimestamp && currentTimestamp <= deadline;
    });

    return activeCycle || null; // Return the active cycle or null if none is active
  };

  //Function to get completed cycles
  const getCompletedCycles = (selectedCircle: Circle): Cycle[] => {
    const currentTimestamp = BigInt(Date.now()); // Current timestamp in milliseconds as BigInt

    // Filter cycles where the current timestamp (in ms) is greater than the cycle's deadline (in seconds, converted to ms)
    return selectedCircle.cycles.filter((cycle) => {
      const { deadline } = cycle;
      return Number(deadline) * 1000 < currentTimestamp; // Convert deadline from seconds to milliseconds and compare
    });
  };

  useEffect(() => {
    if (!selectedCircle) return;
    // Check active cycles when component is mounted or selectedCircle data changes
    const activeCycle = getActiveCycle(selectedCircle[1]);
    setActiveCycles(activeCycle);
    setActiveCircle(selectedCircle[1]);

    // Get the completed cycles from the selectedCircle
    const completedCyclesList = getCompletedCycles(selectedCircle[1]);

    // Set the state with completed cycles
    setCompletedCycles(completedCyclesList);
  }, [selectedCircle]);

  return (
    <main className="h-full flex flex-col overflow-y-auto relative ">
      <section className="h-[10%] flex gap-2 items-center">
        <div className="h-full w-[100px] bg-gray-400 relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY}/${selectedCircle && selectedCircle[1].image}`} // Dynamic image source
            alt={(selectedCircle && selectedCircle[1].name) || "A circle image"} // Better alt text using dynamic name if available
            layout="fill" // Makes the image fill the container
            objectFit="cover" // Ensures the image covers the container without distortion
            priority={true} // Use priority for images above the fold
            className="rounded-md"
          />
        </div>
        <div className="h-full flex flex-col justify-center">
          <div>
            <h2 className=" font-bold text-3xl">
              {selectedCircle && selectedCircle[1].name}
            </h2>
            <p className="flex  text-sm gap-3">
              Created:{" "}
              <span className="text-gray-500">
                <TimeAgo
                  timestamp={
                    selectedCircle
                      ? Number(selectedCircle[1].createdAt) * 1000
                      : 0
                  }
                />
              </span>
            </p>
          </div>
        </div>
      </section>
      {/* summary  */}
      <section className="grid xl:h-[20%]  gap-4 md:grid-cols-2 lg:grid-cols-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Contribution amount
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
              $
              {selectedCircle &&
                formatEther(selectedCircle[1].contributionAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Subscriptions
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
              +{selectedCircle && selectedCircle[1].members.length}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Cycles
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
              <circle cx="12" cy="12" r="10" />

              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedCircle && selectedCircle[1].cycles.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg of 90% participation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Completed Cycle
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
            <div className="text-2xl font-bold">{completedCycles.length}</div>
            <p className="text-xs text-muted-foreground">Current cycle count</p>
          </CardContent>
        </Card>
      </section>

      {/* aditional data */}
      <section className="h-auto xl:h-[65%]   flex flex-col xl:flex-row gap-10">
        <div className="h-full w-full xl:w-2/5 ">
          {/* Current cycle details */}
          <section className="h-[45%]">
            <Card className="col-span-1 border-none shadow-none px-0 h-full py-2  rounded-md cursor-pointer">
              <CardContent className=" h-full flex  gap-3 px-0">
                <div className="flex flex-grow flex-col ">
                  <div className="flex justify-between items-center  h-[16.66%] border-b">
                    <h3 className="font-semibold text-sm ">Current cycle </h3>
                    <small className="text-gray-500n flex items-center space-x-2">
                      (
                      {activeCycle
                        ? formatEther(activeCycle.contributedAmount)
                        : 0}{" "}
                      USDT){"  "}
                      {selectedCircle && (
                        <CountdownTimer selectedCircle={selectedCircle[1]} />
                      )}
                    </small>
                  </div>

                  {/* <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <PiMoney size={15} /> <span>Stake :</span>
                    </h3>
                    <small className="text-gray-500">
                      {selectedCircle
                        ? formatEther(
                            // @ts-ignore
                            calculatePercentage(
                              Number(selectedCircle[1].preStakeAmount),
                              Number(
                                formatEther(
                                  selectedCircle[1].contributionAmount,
                                ),
                              ),
                            ),
                          )
                        : ""}
                    </small>
                  </div> */}

                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <CiUser size={15} /> <span>Benefactor :</span>
                    </h3>
                    <small className="text-gray-500">
                      <WalletAddress
                        address={selectedCircle ? selectedCircle[1].admin : ""}
                      />
                    </small>
                  </div>
                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiUsersThreeBold size={15} /> <span>Members:</span>{" "}
                    </h3>
                    <small className="text-gray-500">
                      {selectedCircle && selectedCircle[1].cycles.length > 0
                        ? selectedCircle[1].cycles[1].members.length
                        : 0}
                    </small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiRecycle size={15} /> <span>Contributions:</span>
                    </h3>
                    <small className="text-gray-500">
                      {selectedCircle &&
                        (selectedCircle[1].cycles.length >
                        selectedCircle[1].members.length + 1 ? (
                          "Pending"
                        ) : (
                          <span className="text-green-500">Active</span>
                        ))}
                    </small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%] gap-3 border-t pt-5">
                    {selectedCircle &&
                      (selectedCircle[1].cycles.length >
                      selectedCircle[1].members.length + 1 ? (
                        <InviteDataForm section="btn" />
                      ) : (
                        <Button
                          variant="secondary"
                          disabled
                          className="w-[50%] h-10"
                        >
                          Invitation end
                        </Button>
                      ))}

                    {selectedCircle &&
                      (() => {
                        const isInvited = invites?.includes(address as string);
                        const isMember = selectedCircle[1]?.members.includes(
                          address as string,
                        );

                        if (isInvited && !isMember) {
                          return (
                            <JoinCircleButton
                              circleId={selectedCircle[1].id}
                              name={selectedCircle[1].name}
                              prestake={selectedCircle[1].preStakeAmount}
                              amount={selectedCircle[1].contributionAmount}
                              className="w-ful"
                              members={selectedCircle[1].members}
                              admin={selectedCircle[1].admin}
                            />
                          );
                        }

                        if (isMember || selectedCircle[1]?.admin == address) {
                          return (
                            <Button
                              className="rounded-none py-2 w-[50%]"
                              onClick={contribute}
                              type="button"
                              disabled={
                                isContributing ||
                                selectedCircle[1].cycles.length >
                                  selectedCircle[1].members.length + 1
                              }
                            >
                              Contribute
                            </Button>
                          );
                        }

                        return null; // Render nothing if neither condition is met
                      })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          <Card className="h-[55%]">
            <CardHeader className="border-b flex flex-col justify-center h-[16%]">
              <CardTitle>Cycle History</CardTitle>
              <CardDescription>Payouts for completed cycles.</CardDescription>
            </CardHeader>
            <CardContent className=" pt-3 h-[84%] px-2">
              <Activities />
            </CardContent>
          </Card>
        </div>
        <div className="h-full  w-full xl:w-3/5 xl:border-l  ">
          <Tabs
            defaultValue="members"
            className="w-full h-full min-h-[50vh] p-0 max-h-[100vh]"
          >
            <TabsList className="w-full justify-start lg:gap-3 rounded-none h-[8%]">
              <TabsTrigger
                value="members"
                className="h-full flex gap-2 lg:gap-3 lg:p-2 p-1"
              >
                <LuUsers size={14} /> Members
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="h-full flex lg:gap-3 lg:p-2 gap-2 p-1"
              >
                <IoChatboxEllipsesOutline size={14} /> Chat
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="h-full flex lg:gap-3 lg:p-2 gap-2 p-1"
              >
                <IoDocumentTextOutline size={14} /> Terms
              </TabsTrigger>
              <TabsTrigger
                value="invite"
                className="h-full flex lg:gap-3 lg:p-2 gap-2 p-1"
              >
                <FaRegAddressCard size={14} /> Invites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members" className=" h-[92%]  p-2">
              <Members />
            </TabsContent>
            <TabsContent value="chat" className="h-[92%]  p-2">
              <Chat />
            </TabsContent>
            <TabsContent value="terms" className="h-[92%]  p-2">
              <Terms />
            </TabsContent>
            <TabsContent value="invite" className="h-[92%]  p-2">
              <Invites groupId={Number(slug)} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
