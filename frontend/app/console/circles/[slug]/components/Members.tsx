import WalletAddress from "@/app/console/components/WalletAddress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddressStatsMap } from "@/types";
import { formatEther, formatUnits } from "viem";

export function Members({ stats }: { stats: AddressStatsMap }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="h-[8%] flex  ">
        <div className="flex items-center gap-2 w-full pl-4 border-b ">
          <div className=" w-[50%] space-y-1">Details</div>
          <div className="w-[25%] text-center font-medium">Cycles</div>

          <div className=" w-[25%] text-center font-medium text-primary">
            Amount
          </div>
        </div>
      </div>
      <div className="space-y-8  h-[92%]  overflow-y-auto pl-4">
        {Object.entries(stats).map(([address, stats]) => (
          <div className="flex items-center gap-2" key={address}>
            <div className=" w-[50%] space-y-1">
              <p className="text-sm font-medium leading-none">
                <WalletAddress address={address} />
              </p>
              <p className="text-sm text-muted-foreground"></p>
            </div>
            <div className="w-[25%] text-center font-medium">
              {stats.occurrences} cycles
            </div>

            <div className=" w-[25%] text-center font-medium text-primary">
              {formatUnits(stats.totalContribution, 6)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
