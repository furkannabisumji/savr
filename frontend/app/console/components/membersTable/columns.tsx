"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Circle } from "@/types";
import WalletAddress from "../WalletAddress";
import TimeAgo from "../TimeToGo";
import JoinCircleButton from "../JoinCircleButton";
import { formatEther } from "viem";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const formatDate = (dt: Date) => {
  const date = new Date(dt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const columns: ColumnDef<Circle>[] = [
  {
    accessorKey: "circle",
    header: ({ column }) => {
      return (
        <div className="text-center font-medium">
          {" "}
          <Button
            variant="ghost"
            className=""
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Circle
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-center">Owner</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {<WalletAddress address={row.original.admin} />}
        </div>
      );
    },
  },
  {
    accessorKey: "created",
    header: () => <div className="text-center">Created</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          <TimeAgo timestamp={Number(row.original.createdAt) * 1000} />
        </div>
      );
    },
  },
  {
    accessorKey: "volume",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {formatEther(row.original.contributionAmount)}
        </div>
      );
    },
  },
  {
    accessorKey: "cycles",
    header: () => <div className="text-center">Cycles</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.totalCycles}
        </div>
      );
    },
  },
  //{
  //   accessorKey: "status",
  //   header: () => <div className="text-center">Status</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <div
  //         // @ts-ignore
  //         className={`text-center font-medium ${row.getValue("status").toUpperCase() == "ACTIVE" ? "text-green-500" : "text-red-500"}`}
  //       >
  //         {row.getValue("status")}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          <JoinCircleButton
            circleId={row.original.id}
            name={row.original.name}
            prestake={row.original.preStakeAmount}
            amount={row.original.contributionAmount}
          />
        </div>
      );
    },
  },
];
