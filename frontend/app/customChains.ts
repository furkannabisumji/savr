import { type Chain } from "viem";

export const lens: Chain = {
  id: 37111, // Ensure this is the correct Chain ID for the Sepolia Testnet Lens Network
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Lens Network Sepolia Testnet",
    symbol: "GRASS", // Ensure this is the correct token for this network
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.lens.dev"], // The RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "Lens explorer",
      url: "https://block-explorer.testnet.lens.dev", // The explorer URL
    },
    snowtrace: {
      name: "Lens explorer",
      url: "https://block-explorer.testnet.lens.dev", // Another explorer URL (optional)
    },
  },
  testnet: true,
};
