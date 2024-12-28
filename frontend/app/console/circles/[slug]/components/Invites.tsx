import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { InviteDataForm } from "./InviteForm";

export function Invites({ groupId }: { groupId: number }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="h-[8%] flex  ">
        <div className="flex items-center gap-2 w-full pl-4 border-b ">
          <div className=" w-[50%] space-y-1 flex justify-start items-center gap-2">
            {" "}
            Member
            <InviteDataForm groupId={groupId} />
          </div>

          <div className=" w-[50%] text-right font-medium pr-4 gap-3  ">
            Status
          </div>
        </div>
      </div>
      <div className="space-y-8  h-[92%]  overflow-y-auto px-4 ">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="flex items-center gap-2" key={index}>
            <div className=" w-[50%] space-y-1">
              <p className="text-sm font-medium leading-none">0x0ie...30</p>
            </div>

            <div className=" w-[50%] text-right font-medium text-primary">
              Accepted
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
