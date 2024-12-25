"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Circle = {
  id: number;
  circle: string;
  owner: string;
  volume: number;
  created: Date;
  cycles: number;
  status: "active" | "ended";
};

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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Circle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("circle")}</div>
      );
    },
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-center">Owner</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("owner")}</div>
      );
    },
  },
  {
    accessorKey: "created",
    header: () => <div className="text-center">Created</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {formatDate(row.getValue("created"))}
        </div>
      );
    },
  },
  {
    accessorKey: "volume",
    header: () => <div className="text-center">Volume</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("volume")}</div>
      );
    },
  },
  {
    accessorKey: "cycles",
    header: () => <div className="text-center">Cycles</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("cycles")}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <div
          // @ts-ignore
          className={`text-center font-medium ${row.getValue("status").toUpperCase() == "ACTIVE" ? "text-green-500" : "text-red-500"}`}
        >
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          <Button>Join</Button>
        </div>
      );
    },
  },
];
