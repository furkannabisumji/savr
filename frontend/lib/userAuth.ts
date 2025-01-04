import { client } from "./client";
import app from "../constants/app.json";
import { walletClient } from "./viem";
// const signer = privateKeyToAccount(
//   process.env.NEXT_PUBLIC_APP_PRIVATE_KEY as `0x${string}`,
// );
import { enableSignless } from "@lens-protocol/client/actions";

export async function authUser(address: any) {
  //First, authenticate as an Onboarding User.
  const authenticated = await client.login({
    onboardingUser: {
      app: app.address,
      wallet: address,
    },

    signMessage: (message) => {
      if (!walletClient) {
        throw new Error("Wallet client is not initialized");
      }

      // Provide the correct structure that signMessage expects
      return walletClient.signMessage({
        account: address as `0x${string}`, // Pass the account (address) here
        message, // Pass the message to be signed
      });
    },
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  console.log(authenticated.value);
}
