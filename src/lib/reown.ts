import { http, type Config } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { bsc, bscTestnet } from "@reown/appkit/networks";
import {
  CHAIN_ID,
  BSC_RPC_URL,
  APP_URL,
  REOWN_PROJECT_ID,
} from "./config";

export const networks = [bsc, bscTestnet] as [typeof bsc, typeof bscTestnet];
export const activeChain = CHAIN_ID === 56 ? bsc : bscTestnet;

export function getMetadata() {
  const url =
    typeof window !== "undefined" ? window.location.origin : APP_URL;
  return {
    name: "Flow",
    description: "Flow Referral Dashboard on BNB Smart Chain",
    url,
    icons: [`${url}/favicon.ico`],
  };
}

let wagmiAdapter: WagmiAdapter | null = null;

export function getWagmiAdapter(): WagmiAdapter {
  if (wagmiAdapter) return wagmiAdapter;

  if (!REOWN_PROJECT_ID) {
    throw new Error(
      "Reown project ID is not configured. Set NEXT_PUBLIC_REOWN_PROJECT_ID or NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env"
    );
  }

  wagmiAdapter = new WagmiAdapter({
    projectId: REOWN_PROJECT_ID,
    networks: [...networks],
    ssr: true,
    transports: {
      [bsc.id]: http(BSC_RPC_URL),
      [bscTestnet.id]: http(BSC_RPC_URL),
    },
  });

  return wagmiAdapter;
}

export function getWagmiConfig(): Config {
  return getWagmiAdapter().wagmiConfig;
}
