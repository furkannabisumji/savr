"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PiMoney, PiRecycle, PiUsersThreeBold } from "react-icons/pi";
import Link from "next/link";
import type { Circle } from "@/types";
import Image from "next/image";
import { formatEther, parseEther } from "viem";
import { useWriteContract } from "wagmi";
import config from "@/constants/config.json";
import TimeAgo from "./TimeToGo";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JoinCircleButton from "./JoinCircleButton";

export default function CircelCard({ circle }: { circle: Circle }) {
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  //write to contract
  const { writeContractAsync: joinFunction } = useWriteContract();

  const calculatePercentage = (x: number, A: number): number => {
    return (x / 100) * A;
  };

  return (
    <Card className="col-span-1 h-[200px] py-2 px-2 rounded-md ">
      <CardContent className=" h-full p-0 flex">
        <Link
          href={`/console/circles/${circle.id}`}
          className="bg-gray-300 w-[30%] h-full block rounded-md relative"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY}/${circle.image}`} // Dynamic image source
            alt={circle.name || "A group image"} // Better alt text using dynamic name if available
            layout="fill" // Makes the image fill the container
            objectFit="cover" // Ensures the image covers the container without distortion
            priority={true} // Use priority for images above the fold
            className="rounded-md"
          />
        </Link>

        <div className="flex flex-grow flex-col pl-1 ">
          <Link
            href={`/console/circles/${circle.id}`}
            className="flex justify-between items-center  h-[20%] border-b "
          >
            <h3 className="font-semibold text-sm hover:underline">
              {circle.name}
            </h3>
            <TimeAgo timestamp={Number(circle.createdAt) * 1000} />
          </Link>
          <div className="flex justify-between items-center h-[20%]">
            <h3 className="font-semibold text-sm flex items-center  gap-2 ">
              <PiRecycle size={15} /> <span>Cycles:</span>
            </h3>
            <small className="text-gray-500">
              {circle.currentCycle}/{circle.totalCycles}
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

          <div className="flex justify-between items-center h-[20%] border-t pt-2">
            <p>
              prestake:{" "}
              <span className=" text-sm">
                {formatEther(
                  // @ts-ignore
                  calculatePercentage(
                    Number(circle.preStakeAmount),
                    Number(formatEther(circle.contributionAmount)),
                  ),
                )}
              </span>
            </p>
            <JoinCircleButton
              circleId={circle.id}
              name={circle.name}
              prestake={circle.preStakeAmount}
              amount={circle.contributionAmount}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
