import { chains } from "@lens-network/sdk/viem";
import { type Address, createWalletClient, custom } from "viem";

// Declare the walletClient outside the block
let walletClient: ReturnType<typeof createWalletClient> | undefined;

if (typeof window !== "undefined") {
  // hoist account
  const [address] = (await window.ethereum!.request({
    method: "eth_requestAccounts",
  })) as [Address];

  walletClient = createWalletClient({
    account: address,
    chain: chains.testnet,
    transport: custom(window.ethereum!),
  });
}

export { walletClient }; // Export it after initialization
