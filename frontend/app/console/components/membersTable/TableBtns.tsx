import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi"; // Assuming this hook is imported from wagmi
import { Button } from "@/components/ui/button"; // Assuming you have a custom button component
import config from "@/constants/config.json"; // Assuming your contract's config is stored here
import { useToast } from "@/hooks/use-toast"; // Assuming you have a custom toast hook for notifications
import { formatEther } from "viem";
import { InviteDataForm } from "../../circles/[slug]/components/InviteForm";
import Link from "next/link";

// This is the component
const TableBtns = ({
  circleId,
  name,
  prestake,
  amount,
  className,
  admin,
  members,
}: {
  circleId: number;
  name: string;
  prestake: bigint;
  amount: bigint;
  className?: string;
  admin: string;
  members: string[];
}) => {
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  // Get the write function from useWriteContract (make sure to adjust this based on your needs)
  const { writeContractAsync: joinFunction } = useWriteContract();
  console.log(circleId);

  // Function to calculate percentage (can be adjusted as needed)
  const calculatePercentage = (x: number, A: number): number => {
    return (x / 100) * A;
  };

  const { data: invites }: { data: string[] | undefined } = useReadContract({
    abi: config.lens.savr.abi, // Contract ABI to interact with the smart contract
    address: config.lens.savr.address as `0x${string}`, // Contract address
    functionName: "getInvitesAddresses",
    args: [circleId],
  });

  // The function to handle the "Join" action
  const join = async () => {
    setCreating(true);
    try {
      //  calculating the amount to stake in your contract
      const amt = calculatePercentage(
        Number(prestake),
        Number(formatEther(amount)),
      );

      // Write to the contract: This is a sample function call to approve tokens for the contract
      // await joinFunction({
      //   abi: config.lens.usdt.abi,
      //   address: config.lens.usdt.address as `0x${string}`,
      //   functionName: "approve", // Example function from your contract ABI
      //   args: [config.lens.savr.address, amt],
      // });

      // Then call the "joinGroup" function
      await joinFunction({
        abi: config.lens.savr.abi,
        address: config.lens.savr.address as `0x${string}`,
        functionName: "joinGroup",
        args: [circleId],
      });

      // Show success toast
      toast({
        title: "Success",
        description: `You have joined the group: ${name}`,
      });
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: `An error occurred while joining the group ${name}.`,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full flex gap-2 items-center justify-center">
      {!invites?.includes(address as string) && (
        <InviteDataForm section="btn" />
      )}

      {invites?.includes(address as string) &&
        !members.includes(address as string) && (
          <Button onClick={join} disabled={creating} className={className}>
            {creating ? "Joining..." : "Join"}
          </Button>
        )}

      {(invites?.includes(address as string) &&
        members.includes(address as string)) ||
      admin === address ? (
        <Link href={`/console/circles/${circleId}?admin=${admin}`}>
          <Button variant="secondary" className={className}>
            View
          </Button>
        </Link>
      ) : null}
    </div>
  );
};

export default TableBtns;
