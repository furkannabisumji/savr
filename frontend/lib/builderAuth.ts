import { privateKeyToAccount } from "viem/accounts";
import { client } from "./client";
import { createSavrApp } from "./create-app";
const signer = privateKeyToAccount(
  process.env.NEXT_PUBLIC_APP_PRIVATE_KEY as `0x${string}`,
);

export async function startAuthAndAppCreation(address: any) {
  console.log("started");
  const authenticated = await client.login({
    builder: {
      address: address,
    },
    signMessage: (message) => signer.signMessage({ message }),
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  const sessionClient = authenticated.value;
  console.log(sessionClient);

  await createSavrApp(sessionClient);
}
