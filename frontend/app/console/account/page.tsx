import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileImage from "./components/ProfileImage";
import Link from "next/link";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function Console() {
  return (
    <main className="h-full flex flex-col gap-6 overflow-y-auto  ">
      {/* Profile */}

      <section className=" flex flex-col xl:flex-row xl:h-[20%] gap-4">
        <div className=" w-full xl:w-[15%] ">
          <ProfileImage src="/profile.jpg" alt="profile image" />
        </div>
        <div className=" w-full xl:w-[85%]">
          <div className=" xl:h-[50%] flex items-center">
            <h2 className="font-bold text-xl">William Ikeji</h2>
          </div>

          <div className=" xl:h-[50%] flex flex-col xl:flex-row xl:gap-10 xl:items-center gap-4 items-start pt-6 xl:pt-0">
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Username</div>
              <div className=" text-lg">@Codypharm</div>
            </div>
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Wallet</div>
              <div className=" text-lg">0x0e6a....u81h9</div>
            </div>
            <div className=" ">
              <div className="text-gray-400 text-md h-[50%]">Email</div>
              <div className=" text-lg">williamikeji@gmail.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* summary  */}
      <section className="grid xl:h-[18%]  gap-4 md:grid-cols-2 lg:grid-cols-3 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Transactions
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              Accumulated transactions.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Circles
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
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              Total circles created.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Users
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
            <div className="text-2xl font-bold">+125</div>
            <p className="text-xs text-muted-foreground">
              Total registered users.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="flex justify-between h-[8%] items-center border-b py-2 px-2">
        <div className="bg-white ">
          <Select defaultValue="all">
            <SelectTrigger className="w-[100px]  border-border/40 bg-background/50 backdrop-blur">
              Filter
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all" className="cursor-pointer">
                  All
                </SelectItem>
                <SelectItem value="mine" className="cursor-pointer">
                  My Circles
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white">
          <Select defaultValue="date">
            <SelectTrigger className="w-[180px] border-border/40 bg-background/50 backdrop-blur">
              Sort By
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest" className="cursor-pointer">
                  Latest
                </SelectItem>
                <SelectItem value="value" className="cursor-pointer">
                  Value
                </SelectItem>
                <SelectItem value="members" className="cursor-pointer">
                  Members
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*  data */}
      <section className=" xl:h-[54%] grid lg:grid-cols-2 xl:grid-cols-3  gap-4 pb-10 px-3 w-full xl:overflow-y-auto">
        {Array.from({ length: 20 }).map((_, index) => (
          <Link href={`/console/circles/${index}`} key={index}>
            <Card className="col-span-1 h-[200px] py-2 px-2 rounded-md cursor-pointer">
              <CardContent className=" h-full flex pb-0 px-0 gap-3">
                <div className="bg-gray-300 w-[30%] h-full rounded-md"></div>
                <div className="flex flex-grow flex-col ">
                  <div className="flex justify-between items-center  h-[20%] border-b">
                    <h3 className="font-semibold text-sm ">Web 3 Legends</h3>
                    <small className="text-gray-500">2 months ago</small>
                  </div>
                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <PiRecycle size={15} /> <span>Cycles:</span>
                    </h3>
                    <small className="text-gray-500">20.0</small>
                  </div>
                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiUsersThreeBold size={15} /> <span>Members:</span>{" "}
                    </h3>
                    <small className="text-gray-500">1.2k</small>
                  </div>

                  <div className="flex justify-between items-center h-[20%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiMoney size={15} /> <span>Contributions:</span>
                    </h3>
                    <small className="text-gray-500">20</small>
                  </div>

                  <div className="flex justify-end items-center h-[20%] border-t pt-2">
                    <Button className="rounded-none py-2 w-[30%] ">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
