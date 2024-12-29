import * as React from "react";
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

export function InviteDataForm({ groupId }: { groupId: number }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="p-2">
            <FaPlus size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Provide address of the user you wish to invite.
            </DialogDescription>
          </DialogHeader>
          <InviteForm setOpen={setOpen} groupId={groupId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="p-2">
          <FaPlus size={20} />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Invite Member</DrawerTitle>
          <DrawerDescription>
            Provide address of the user you wish to invite.
          </DrawerDescription>
        </DrawerHeader>
        <InviteForm className="px-4" setOpen={setOpen} groupId={groupId} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useWriteContract } from "wagmi";
import config from "@/constants/config.json";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

interface InviteFormProps extends React.ComponentProps<"form"> {
  setOpen: (open: boolean) => void;
  groupId: number;
}

function InviteForm({ className, setOpen, groupId, ...rest }: InviteFormProps) {
  const [address, setAddress] = React.useState<string>("");
  const [creating, setCreating] = React.useState(false);
  const { toast } = useToast();
  const { slug } = useParams();

  //write to contract
  const { writeContractAsync: inviteFunction } = useWriteContract();
  const inviteMember = async () => {
    setCreating(true);
    if (!address) {
      toast({
        title: "Error",
        description: "All fields must be filled out.",
      });
      setCreating(false);
      return;
    }

    try {
      await inviteFunction({
        abi: config.savr.abi, // Contract ABI to interact with the smart contract
        address: config.savr.address as `0x${string}`, // Contract address
        functionName: "inviteGroup", // The function in the smart contract to be called
        args: [slug, address], // Arguments for the contract function
      });

      toast({
        title: "Invite sent",
        description: `Invite for ${address} was created succesfully`,
      });
    } catch (error) {
      console.error("Error in inviteMember:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating an invite.",
      });
    } finally {
      setCreating(false);
      setOpen(false);
    }
  };

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="id">Circle Id</Label>
        <Input type="text" id="id" readOnly={true} defaultValue={slug} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          min={0}
          onChange={(e) => setAddress(e.target.value)}
          id="address"
          placeholder="Member address"
        />
      </div>

      <Button type="button" onClick={inviteMember} disabled={creating}>
        Invite
      </Button>
    </form>
  );
}
