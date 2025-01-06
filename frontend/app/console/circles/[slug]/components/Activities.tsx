import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Cycle } from "@/types";
import { formatEther, formatUnits } from "viem";

export function Activities({ cycles }: { cycles: Cycle[] }) {
  return (
    <div className="space-y-8  h-full overflow-y-auto pl-4">
      {cycles.map((cycle, index) => (
        <div className="flex items-center gap-2" key={index}>
          <div className=" w-[33.33%] space-y-1">
            <p className="text-sm font-medium leading-none">
              $ {formatUnits(cycle.contributedAmount, 6)}
            </p>
          </div>
          <div className="w-[33.33%] text-center font-medium">
            {formatDate(Number(cycle.createdAt))}
          </div>
          <div className=" w-[33.33%] text-center font-medium ">
            {formatDate(Number(cycle.deadline))}
          </div>
        </div>
      ))}
    </div>
  );
}
