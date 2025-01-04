"use client";

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import {
  LensConfig,
  LensProvider,
  development,
  production,
} from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import { lens } from "./customChains";

// connect kit doesn't export the config type, so we create it here
type ConnectKitConfig = Parameters<typeof getDefaultConfig>[0];

// differences in config between the environments
const appConfigs = {
  development: {
    connectkit: {
      chains: [lens],
      transports: {
        // RPC URL for each chain
        [lens.id]: http(`${lens.rpcUrls.default.http}`),
      },
      // Required API Keys,
    } as Partial<ConnectKitConfig>,
    lens: {
      environment: development,
      debug: true,
    } as Partial<LensConfig>,
  },
  production: {
    connectkit: {
      chains: [polygon],
      transports: {
        [polygon.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    lens: {
      environment: production,
    } as Partial<LensConfig>,
  },
};

// select the config based on the environment
const appConfig = appConfigs["development"]; // or appConfigs["production"]

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Savr",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ssr: true,
    ...appConfig.connectkit,
  }),
);

const queryClient = new QueryClient();

const lensConfig: LensConfig = {
  environment: development, // or production
  bindings: bindings(wagmiConfig),
  ...appConfig.lens,
};

export function CustomLensProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <LensProvider config={lensConfig}>{children}</LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
