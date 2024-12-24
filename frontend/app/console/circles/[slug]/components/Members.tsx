import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Members() {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="h-[8%] flex  ">
        <div className="flex items-center gap-2 w-full pl-4 border-b ">
          <div className=" w-[50%] space-y-1">Details</div>
          <div className="w-[25%] text-center font-medium">Benefits</div>

          <div className=" w-[25%] text-center font-medium text-primary">
            Amount
          </div>
        </div>
      </div>
      <div className="space-y-8  h-[92%]  overflow-y-auto pl-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="flex items-center gap-2" key={index}>
            <div className=" w-[50%] space-y-1">
              <p className="text-sm font-medium leading-none">Olivia Martin</p>
              <p className="text-sm text-muted-foreground">
                olivia.martin@email.com
              </p>
            </div>
            <div className="w-[25%] text-center font-medium">
              {index + 1} cycles
            </div>

            <div className=" w-[25%] text-center font-medium text-primary">
              $1,999.00
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
