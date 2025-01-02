import { client } from "./client";
import app from "../constants/app.json";
import { privateKeyToAccount } from "viem/accounts";
import { createSavrApp } from "./create-app";
const signer = privateKeyToAccount(
  process.env.NEXT_PUBLIC_APP_PRIVATE_KEY as `0x${string}`,
);

export async function authUser(address: any) {
  //First, authenticate as an Onboarding User.
  const authenticated = await client.login({
    onboardingUser: {
      app: app.address,
      wallet: address,
    },

    signMessage: (message) => signer.signMessage({ message }),
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  const sessionClient = authenticated.value;
  console.log(sessionClient);
}
