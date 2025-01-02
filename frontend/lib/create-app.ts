import { uploadAsJson } from "./storage-client";
import { createApp, fetchApp } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { walletClient } from "./viem";

export async function createSavrApp(sessionClient: any) {
  const metadata = {
    $schema: "https://json-schemas.lens.dev/app/1.0.0.json",
    lens: {
      id: "e51fa2ff-b6aa-4610-b629-c9a62d5fcc61",
      name: "savr",
      tagline: "Decentralized Rosca",
      description: "An app to make ROSCA mose decentralized and safe.",
      logo: "lens://4f91cab87ab5e4f5066f878b72…",
      url: "https://savr-lens.vercel.app/",
      platforms: ["web", "ios", "android"],
    },
  };

  const { Hash, Name, Size } = await uploadAsJson(metadata);
  const uri = process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY + Hash;

  console.log(uri, Hash);

  const result = await createApp(sessionClient, {
    metadataUri: uri, // the URI from the previous step
  })
    .andThen(handleWith(walletClient))
    .andThen(sessionClient.waitForTransaction)
    .andThen((txHash) => fetchApp(sessionClient, { txHash }));

  if (result.isErr()) {
    return console.error(result.error);
  }

  const app = result.value;
  console.log(app);
}
