import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Activities() {
  return (
    <div className="space-y-8  h-full overflow-y-auto pl-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex items-center gap-2" key={index}>
          <div className=" w-[50%] space-y-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="w[25%] text-center font-medium">23 Dec 2024</div>
          <div className=" w-[25%] text-center font-medium text-primary">
            $1,999.00
          </div>
        </div>
      ))}
    </div>
  );
}
