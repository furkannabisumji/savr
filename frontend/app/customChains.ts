import { type Chain } from "viem";

export const lens: Chain = {
  id: 37111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Lens Network Sepolia Testnet",
    symbol: "GRASS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] },
  },
  blockExplorers: {
    default: {
      name: "Lens explorer",
      url: "https://block-explorer.testnet.lens.dev",
    },
    snowtrace: {
      name: "Lens explorer",
      url: "https://block-explorer.testnet.lens.dev",
    },
  },
  testnet: false,
};
