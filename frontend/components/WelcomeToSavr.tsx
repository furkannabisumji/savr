"use client";

import {
  SessionType,
  useSession as useLensSession,
} from "@lens-protocol/react-web";
import { useAccount } from "wagmi";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { LogoutButton } from "./LogoutButton";
import { DisconnectWalletButton } from "./DisconnectWalletButton";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { FaUser } from "react-icons/fa";
import { getUsers } from "@/lib/lens";
import { authUser } from "@/lib/userAuth";

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateEthAddress = (
  address?: string,
  separator: string = "••••",
) => {
  if (!address) return "";
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};

export function WelcomeToSavr() {
  const { isConnected, address, isConnecting } = useAccount();
  const { data: session } = useLensSession();

  useEffect(() => {
    getUsers(address as string);
  }, [address]);

  // step 1. connect wallet
  if (!isConnected && !isConnecting) {
    return (
      <>
        <p className="mb-4 text-gray-500">
          Connect your wallet to get started.
        </p>
        <ConnectWalletButton />
      </>
    );
  }

  // step 2. connect Lens Profile
  if (!session?.authenticated && address) {
    return (
      <>
        {/* <LoginForm owner={address} /> */}
        <p className=" text-base text-gray-500">
          No Lens Profiles found in this wallet.
        </p>
        <div className="bg-white rounded-xl h-80 w-72 p-7">
          <div className="h-full rounded-xl w-full bg-green-200 flex items-center justify-center">
            <FaUser size={200} className="text-green-500" />
          </div>
        </div>
        <div className=" w-full max-w-sm items-center  flex flex-col gap-2 py-5">
          <Button
            type="button"
            onClick={() => authUser(address)}
            className="w-full h-12 font-semibold"
          >
            Get one
          </Button>
        </div>
        <div className="mt-2">
          <DisconnectWalletButton />
        </div>
      </>
    );
  }

  // step 3. show Profile details
  if (session && session.type === SessionType.WithProfile) {
    return (
      <>
        <p className="mb-4 text-gray-500">
          You are logged in as{" "}
          <span className="text-gray-800 font-semibold">
            {session.profile.handle?.fullHandle ?? session.profile.id}
          </span>
          .
        </p>
        <LogoutButton />
      </>
    );
  }

  // you can handle other session types here
  return null;
}
