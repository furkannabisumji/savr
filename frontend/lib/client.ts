import { PublicClient, testnet, evmAddress } from "@lens-protocol/client";

export const client = PublicClient.create({
  environment: testnet,
  storage: window.localStorage,
});
