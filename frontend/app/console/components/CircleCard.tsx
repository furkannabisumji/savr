"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import Link from "next/link";
import type { Circle } from "@/types";
import Image from "next/image";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import config from "@/constants/config.json";

export default function CircelCard({
  circle,
  id,
}: {
  circle: Circle;
  id: number;
}) {
  return (
    <Link href={`/console/circles/${id}`}>
      <Card className="col-span-1 h-[200px] py-2 px-2 rounded-md cursor-pointer">
        <CardContent className=" h-full flex pb-0 px-0 gap-3">
          <div className="bg-gray-300 w-[30%] h-full rounded-md relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY}/${circle.image}`} // Dynamic image source
              alt={circle.name || "A group image"} // Better alt text using dynamic name if available
              layout="fill" // Makes the image fill the container
              objectFit="cover" // Ensures the image covers the container without distortion
              priority={true} // Use priority for images above the fold
              className="rounded-md"
            />
          </div>

          <div className="flex flex-grow flex-col ">
            <div className="flex justify-between items-center  h-[20%] border-b">
              <h3 className="font-semibold text-sm ">{circle.name}</h3>
              {/* <small className="text-gray-500">2 months ago</small> */}
            </div>
            <div className="flex justify-between items-center h-[20%]">
              <h3 className="font-semibold text-sm flex items-center  gap-2 ">
                <PiRecycle size={15} /> <span>Cycles:</span>
              </h3>
              <small className="text-gray-500">
                {formatEther(circle.currentCycle)}/
                {formatEther(circle.totalCycles)}
              </small>
            </div>
            <div className="flex justify-between items-center h-[20%]">
              <h3 className="font-semibold text-sm flex items-center gap-2 ">
                <PiUsersThreeBold size={15} /> <span>Members:</span>{" "}
              </h3>
              <small className="text-gray-500">{circle.members.length}</small>
            </div>

            <div className="flex justify-between items-center h-[20%]">
              <h3 className="font-semibold text-sm flex items-center gap-2 ">
                <PiMoney size={15} /> <span>Contributions:</span>
              </h3>
              <small className="text-gray-500">
                {formatEther(circle.contributionAmount)}
              </small>
            </div>

            <div className="flex justify-end items-center h-[20%] border-t pt-2">
              <Button className="rounded-none py-2 w-[30%] ">Join</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
