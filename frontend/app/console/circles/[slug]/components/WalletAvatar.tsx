import React, { useEffect, useState } from "react";
import * as blockies from "ethereum-blockies"; // Correct import
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WalletAvatar = ({ walletAddress }: { walletAddress: string }) => {
  const [identiconUrl, setIdenticonUrl] = useState("");

  useEffect(() => {
    if (walletAddress) {
      // Generate the blockie
      const options = {
        seed: walletAddress.toLowerCase(), // Seed string
        size: 8, // Dimensions of the blockie (8x8 grid)
        scale: 10, // Scale of the image
      };
      const canvas = blockies.create(options); // Correct function call
      setIdenticonUrl(canvas.toDataURL()); // Convert to data URL
    }
  }, [walletAddress]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Avatar>
            <AvatarImage
              src={identiconUrl}
              alt={`Identicon for ${walletAddress}`}
            />
            <AvatarFallback>WA</AvatarFallback> {/* Wallet Avatar fallback */}
          </Avatar>
        </TooltipTrigger>
        <TooltipContent className="bg-transparent text-black py-3">
          <div>{`${walletAddress}`}</div> {/* Tooltip content */}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletAvatar;
