import * as React from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import Image from "next/image";

export function CircleForm() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <FaPlus size={20} /> Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Circle</DialogTitle>
            <DialogDescription>
              Provide required details and click create when done to create your
              circle.
            </DialogDescription>
          </DialogHeader>
          <CreateForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <FaPlus size={20} /> Create
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Circle</DrawerTitle>
          <DrawerDescription>
            Provide required details and click create when done to create your
            circle.
          </DrawerDescription>
        </DrawerHeader>
        <CreateForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useReadContract, useWriteContract } from "wagmi";
import config from "@/constants/config.json";
import { useToast } from "@/hooks/use-toast";
import { parseEther } from "viem";

interface CreateFormProps extends React.ComponentProps<"form"> {
  setOpen: (open: boolean) => void;
}

function CreateForm({ className, setOpen, ...rest }: CreateFormProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>("");
  const [cycles, setCycles] = React.useState<number | null>(null);
  const [stake, setStake] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState<number | null>(null);
  const [creating, setCreating] = React.useState(false);
  const { toast } = useToast();

  //write to contract
  const { writeContractAsync: createFunction } = useWriteContract();
  const createCircle = async () => {
    setCreating(true);
    if (!name || !image || cycles == null || stake == null || amount == null) {
      toast({
        title: "Error",
        description: "All fields must be filled out.",
      });
      setCreating(false);
      return;
    }

    // Ensure the numbers are greater than zero
    if (Number(cycles) <= 0 || Number(stake) <= 0 || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Cycles, stake, and amount must be greater than zero.",
      });
      setCreating(false);
      return;
    }

    try {
      // Convert numbers to strings and parse to Ether
      const parsedAmount = parseEther(amount.toString());
      const parsedCycles = parseEther(cycles.toString());

      await createFunction({
        abi: config.savr.abi, // Contract ABI to interact with the smart contract
        address: config.savr.address as `0x${string}`, // Contract address
        functionName: "createGroup", // The function in the smart contract to be called
        args: [name, image, parsedAmount, parsedCycles, stake], // Arguments for the contract function
      });

      toast({
        title: "Circle Creation",
        description: `${name} was created succesfully`,
      });
    } catch (error) {
      console.error("Error in createCircle:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the circle.",
      });
    } finally {
      setCreating(false);
      setOpen(false);
    }
  };

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Name</Label>
        <Input
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="email"
          placeholder="Circle name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount (GRASS)</Label>
        <Input
          type="number"
          min={0}
          onChange={(e) => setAmount(Number(e.target.value))}
          id="amount"
          placeholder="Contribution amount"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cycles">Cycles</Label>
        <Input
          type="number"
          min={0}
          onChange={(e) => setCycles(Number(e.target.value))}
          id="cycles"
          placeholder="Max Cycles"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stake">Prestake (%)</Label>
        <Input
          type="number"
          min={0}
          max={100}
          value={stake as number}
          id="stake"
          onChange={(e) => {
            const value = Number(e.target.value);
            // Enforce the maximum and minimum values
            if (value >= 0 && value <= 100) {
              setStake(value);
            } else if (value > 100) {
              setStake(100); // Optional: Automatically cap to 100
            } else {
              setStake(0); // Optional: Automatically cap to 0
            }
          }}
          placeholder="Prestaking percentage"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stake">Circle Image</Label>
        <div className="flex justify-center items-center h-52 bg-gray-100">
          <ImageUploader image={image} setImage={setImage} />
        </div>
      </div>

      <Button type="button" onClick={createCircle} disabled={creating}>
        Create circle
      </Button>
    </form>
  );
}

interface ImageUploaderProps {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const file = e.target.files[0];

      try {
        if (!file) {
          throw new Error("No file selected for upload");
        }

        // Wrap the file in an array if `lighthouse.upload` expects an iterable
        const filesArray = [file];

        // Upload the file(s) to Lighthouse
        const { data } = await lighthouse.upload(
          filesArray, // Ensure this matches the SDK's requirements
          process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY as string,
        );
        console.log(`Upload response:`, data);

        // Construct the uploaded image URL
        const uploadedImageUrl = `${data.Hash}`;
        setImage(uploadedImageUrl); // Set the image URL in state
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error",
          description: "Error uploading file",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-full relative w-full">
      <div
        onClick={() => document.getElementById("imageUploadInput")?.click()}
        className={`absolute inset-0 z-50 w-full flex justify-center items-center
          border-2 border-dashed rounded-md cursor-pointer
          ${image ? "border-transparent" : "border-gray-400 hover:border-gray-500"}`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 animate-spin text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Uploading...</span>
          </div>
        ) : (
          !image && (
            <span className="text-gray-600 flex items-center gap-3">
              <FiUploadCloud size={20} /> Click to upload
            </span>
          )
        )}
      </div>
      <input
        type="file"
        id="imageUploadInput"
        accept="image/.jpg , image.webp, image.png"
        className="hidden"
        onChange={handleImageUpload}
      />
      {image && (
        <div className="relative w-full h-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY}${image}`}
            alt="Uploaded"
            priority={true}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
