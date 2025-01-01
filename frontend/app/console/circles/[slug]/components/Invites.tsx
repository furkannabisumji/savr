import { InviteDataForm } from "./InviteForm";
import { useReadContract } from "wagmi";
import config from "@/constants/config.json";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Invites({ groupId }: { groupId: number }) {
  const { slug } = useParams();
  const { data: invites }: { data: string[] | undefined } = useReadContract({
    abi: config.savr.abi, // Contract ABI to interact with the smart contract
    address: config.savr.address as `0x${string}`, // Contract address
    functionName: "getInvitesAddresses",
    args: [slug],
  });

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="h-[8%] flex  ">
        <div className="flex items-center gap-2 w-full pl-4 border-b ">
          <div className=" w-[50%] space-y-1 flex justify-start items-center gap-2">
            {" "}
            Member
            <InviteDataForm />
          </div>

          <div className=" w-[50%] text-right font-medium pr-4 gap-3  ">
            Status
          </div>
        </div>
      </div>
      <div className="space-y-8  h-[92%]  overflow-y-auto px-4 ">
        {invites?.map((addr, index) => (
          <div className="flex items-center gap-2" key={index}>
            <div className=" w-[50%] space-y-1">
              <p className="text-sm font-medium leading-none">
                {/* <WalletAddress address={addr} /> */}
                {addr}
              </p>
            </div>

            <div className=" w-[50%] text-right font-medium text-primary">
              member
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
