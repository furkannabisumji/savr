import React, { useState } from "react";
import { useWriteContract } from "wagmi"; // Assuming this hook is imported from wagmi
import { Button } from "@/components/ui/button"; // Assuming you have a custom button component
import config from "@/constants/config.json"; // Assuming your contract's config is stored here
import { useToast } from "@/hooks/use-toast"; // Assuming you have a custom toast hook for notifications
import { formatEther } from "viem";

// This is the component
const JoinCircleButton = ({
  circleId,
  name,
  prestake,
  amount,
}: {
  circleId: number;
  name: string;
  prestake: bigint;
  amount: bigint;
}) => {
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  // Get the write function from useWriteContract (make sure to adjust this based on your needs)
  const { writeContractAsync: joinFunction } = useWriteContract();

  // Function to calculate percentage (can be adjusted as needed)
  const calculatePercentage = (x: number, A: number): number => {
    return (x / 100) * A;
  };

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
      await joinFunction({
        abi: config.usdt.abi,
        address: config.usdt.address as `0x${string}`,
        functionName: "approve", // Example function from your contract ABI
        args: [config.savr.address, amt],
      });

      // Then call the "joinGroup" function
      await joinFunction({
        abi: config.savr.abi,
        address: config.savr.address as `0x${string}`,
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
    <Button onClick={join} disabled={creating} className="">
      {creating ? "Joining..." : `Join `}
    </Button>
  );
};

export default JoinCircleButton;
