"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activities } from "./components/Activities";
import { LuUsers } from "react-icons/lu";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { Chat } from "./components/Chat";
import { Members } from "./components/Members";
import { Terms } from "./components/Terms";

export default function CircleDetail() {
  return (
    <main className="h-full flex flex-col overflow-y-auto relative ">
      <section className="h-[10%] flex gap-2 items-center">
        <div className="h-full w-[100px] bg-gray-400 "></div>
        <div className="h-full flex flex-col justify-center">
          {" "}
          <h2 className=" font-bold text-3xl">Web3 Legends</h2>
          <p className="flex  text-sm gap-3">
            Created: <span className="text-gray-500">23 Dec 2024</span>
          </p>
        </div>
      </section>
      {/* summary  */}
      <section className="grid xl:h-[20%]  gap-4 md:grid-cols-2 lg:grid-cols-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Volume
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
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Subscriptions
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
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Cycles Completed
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              Avg of 90% participation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Active Cycle
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Days</div>
            <p className="text-xs text-muted-foreground">To end 25 Dec 2025</p>
          </CardContent>
        </Card>
      </section>

      {/* aditional data */}
      <section className="h-auto xl:h-[65%]   flex flex-col xl:flex-row gap-10">
        <div className="h-full w-full xl:w-2/5 ">
          {/* Current cycle details */}
          <section className="h-[45%]">
            <Card className="col-span-1 border-none shadow-none px-0 h-full py-2  rounded-md cursor-pointer">
              <CardContent className=" h-full flex  gap-3 px-0">
                <div className="flex flex-grow flex-col ">
                  <div className="flex justify-between items-center  h-[16.66%] border-b">
                    <h3 className="font-semibold text-sm ">Current cycle</h3>
                    <small className="text-gray-500">2 months ago</small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <PiRecycle size={15} /> <span>Funding ends :</span>
                    </h3>
                    <small className="text-gray-500">2 day 3 hours</small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                      <CiUser size={15} /> <span>Benefactor :</span>
                    </h3>
                    <small className="text-gray-500">William Ikeji</small>
                  </div>
                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiUsersThreeBold size={15} /> <span>Members:</span>{" "}
                    </h3>
                    <small className="text-gray-500">1.2k</small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%]">
                    <h3 className="font-semibold text-sm flex items-center gap-2 ">
                      <PiMoney size={15} /> <span>Contributions:</span>
                    </h3>
                    <small className="text-gray-500">20</small>
                  </div>

                  <div className="flex justify-between items-center h-[16.66%] gap-3 border-t pt-5">
                    <Button
                      variant="outline"
                      className="rounded-none py-2 w-[50%] "
                    >
                      Opt-out
                    </Button>
                    <Button className="rounded-none py-2 w-[50%] ">
                      Contribute
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          <Card className="h-[55%]">
            <CardHeader className="border-b flex flex-col justify-center h-[16%]">
              <CardTitle>Cycle History</CardTitle>
              <CardDescription>Payouts for completed cycles.</CardDescription>
            </CardHeader>
            <CardContent className=" pt-3 h-[84%] px-2">
              <Activities />
            </CardContent>
          </Card>
        </div>
        <div className="h-full  w-full xl:w-3/5 xl:border-l  ">
          <Tabs defaultValue="members" className="w-full h-full min-h-[50vh]">
            <TabsList className="w-full justify-start rounded-none h-[8%]">
              <TabsTrigger value="members" className="h-full gap-3">
                <LuUsers size={20} /> Members
              </TabsTrigger>
              <TabsTrigger value="chat" className="h-full gap-3">
                <IoChatboxEllipsesOutline size={20} /> Chat
              </TabsTrigger>
              <TabsTrigger value="terms" className="h-full">
                <IoDocumentTextOutline size={20} /> Terms
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members" className=" h-[92%]  p-2">
              <Members />
            </TabsContent>
            <TabsContent value="chat" className="h-[92%]  p-2">
              <Chat />
            </TabsContent>
            <TabsContent value="terms" className="h-[92%]  p-2">
              <Terms />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
