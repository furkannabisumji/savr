import { fetchAccount } from "@lens-protocol/client/actions";
import { client } from "./client";
import { evmAddress } from "@lens-protocol/client";
const resumed = await client.resumeSession();
import { currentSession } from "@lens-protocol/client/actions";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(
  process.env.NEXT_PUBLIC_APP_PRIVATE_KEY as `0x${string}`,
);

export const getUsers = async (address: string) => {
  const result = await fetchAccount(client, {
    address: evmAddress(address),
  });

  if (result.isErr()) {
    return console.error(result.error);
  }

  const account = result.value;

  console.log(account);
};

export const login = async () => {
  const resumed = await client.resumeSession();

  if (resumed.isErr()) {
    return console.error(resumed.error);
  }

  let sessionClient = resumed.value;
  console.log(sessionClient);
  const authenticated = await client.login({
    onboardingUser: {
      app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
      wallet: signer.address,
    },
    signMessage: (message) => signer.signMessage({ message }),
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  sessionClient = authenticated.value;

  // console.log(sessionClient);
};
