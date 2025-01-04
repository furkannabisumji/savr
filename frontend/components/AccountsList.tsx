import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AccountsAvailableResponse } from "@/types";
import Image from "next/image";
import { client } from "@/lib/client";
import { walletClient } from "@/lib/viem";
import { enableSignless } from "@lens-protocol/client/actions";

export function AccountsList({
  accountsAvailable,
}: {
  accountsAvailable: AccountsAvailableResponse;
}) {
  function removeDuplicatesByAddress(
    accounts: AccountsAvailableResponse,
  ): AccountsAvailableResponse {
    const seen = new Set<string>();
    const filteredItems = accounts.items.filter((item) => {
      const address = item.account.address;
      if (seen.has(address)) {
        return false;
      }
      seen.add(address);
      return true;
    });

    return {
      ...accounts,
      items: filteredItems,
    };
  }
  const auth = async (address: string, owner: string) => {
    const authenticated = await client.login({
      accountOwner: {
        account: address,
        app: process.env.NEXT_PUBLIC_APP_ADDRESS,
        owner,
      },
      signMessage: (message) => {
        if (!walletClient) {
          throw new Error("Wallet client is not initialized");
        }

        // Provide the correct structure that signMessage expects
        return walletClient.signMessage({
          account: owner as `0x${string}`, // Pass the account (address) here
          message, // Pass the message to be signed
        });
      },
    });

    if (authenticated.isErr()) {
      return console.error(authenticated.error);
    }

    // SessionClient: { ... }
    const sessionClient = authenticated.value;

    const result = await enableSignless(sessionClient);

    if (result.isErr()) {
      return console.error(result.error);
    }

    const session = result.value;
    console.log(session);
  };

  console.log(removeDuplicatesByAddress(accountsAvailable));
  return (
    <TooltipProvider>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <h3 className="text-sm text-center font-semibold">Choose a profile</h3>
        <CarouselContent>
          {removeDuplicatesByAddress(accountsAvailable).items.map(
            (item, index) =>
              item.account.metadata && item.account.metadata?.picture ? (
                <CarouselItem
                  onClick={() => auth(item.account.address, item.account.owner)}
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 cursor-pointer"
                >
                  <div className="p-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-0">
                          <CardContent className="flex aspect-square items-center justify-center p-1">
                            <Image
                              src={`${item.account.metadata.picture}`}
                              alt="accounts"
                              width={0} // Dynamically scale width
                              height={0} // Dynamically scale height
                              sizes="100vw" // Take the full width of the container
                              className="w-full h-auto object-cover rounded-md" // Ensure proper scaling
                            />
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {item.account.username?.localName || "Unknown User"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CarouselItem>
              ) : null,
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </TooltipProvider>
  );
}
