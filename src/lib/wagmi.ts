"use client";

import { createConfig, http, type Config } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "@wagmi/connectors";
import { CHAIN_ID, BSC_RPC_URL, APP_URL, WALLETCONNECT_PROJECT_ID } from "./config";

export const activeChain = CHAIN_ID === 56 ? bsc : bscTestnet;

function getConnectors() {
  const walletConnectConnector = WALLETCONNECT_PROJECT_ID
    ? [
        walletConnect({
          projectId: WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: "GrokFANS",
            description: "GrokFANS Referral Dashboard on BNB Smart Chain",
            url: APP_URL,
            icons: [`${APP_URL}/favicon.ico`],
          },
          showQrModal: true,
        }),
      ]
    : [];

  return [
    metaMask(),
    injected({ target: "trust", shimDisconnect: true }),
    coinbaseWallet({ appName: "GrokFANS" }),
    ...walletConnectConnector,
    injected({ shimDisconnect: true }),
  ];
}

/** Created only in the browser — avoids WalletConnect/indexedDB during SSR. */
export function createWagmiConfig(): Config {
  return createConfig({
    chains: [bsc, bscTestnet],
    connectors: getConnectors(),
    transports: {
      [bsc.id]: http(BSC_RPC_URL),
      [bscTestnet.id]: http(BSC_RPC_URL),
    },
    ssr: true,
  });
}
