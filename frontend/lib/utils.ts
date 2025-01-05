import { AddressStatsMap, Circle, Cycle } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to check active cycles
export const getActiveCycle = (selectedCircle: Circle): Cycle | null => {
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // Get current timestamp as BigInt

  // Find the active cycle: If the current timestamp is between createdAt and deadline
  const activeCycle = selectedCircle.cycles.find((cycle) => {
    const { createdAt, deadline } = cycle;
    return createdAt <= currentTimestamp && currentTimestamp <= deadline;
  });

  return activeCycle || null; // Return the active cycle or null if none is active
};

//Function to get completed cycles
export const getCompletedCycles = (selectedCircle: Circle): Cycle[] => {
  const currentTimestamp = BigInt(Date.now()); // Current timestamp in milliseconds as BigInt

  // Filter cycles where the current timestamp (in ms) is greater than the cycle's deadline (in seconds, converted to ms)
  return selectedCircle.cycles.filter((cycle) => {
    const { deadline } = cycle;
    return Number(deadline) * 1000 < currentTimestamp; // Convert deadline from seconds to milliseconds and compare
  });
};

// calculate cycles amounts
export function calculateAddressStats(cycles: Cycle[]): AddressStatsMap {
  const stats: AddressStatsMap = {};

  for (const cycle of cycles) {
    const cycleContribution = cycle.contributedAmount;

    for (const address of cycle.members) {
      if (stats[address]) {
        stats[address].occurrences++;
        stats[address].totalContribution += cycleContribution;
      } else {
        stats[address] = {
          occurrences: 1,
          totalContribution: cycleContribution,
        };
      }
    }
  }

  return stats;
}

export function formatDate(seconds: number): string {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function calculateCycleContributions(
  circles: Circle[],
  address: string,
): bigint {
  return circles.reduce((totalContribution, circle) => {
    return (
      totalContribution +
      circle.cycles.reduce((cycleContribution, cycle) => {
        return cycle.members.includes(address)
          ? cycleContribution + cycle.contributedAmount
          : cycleContribution;
      }, BigInt(0))
    );
  }, BigInt(0));
}
