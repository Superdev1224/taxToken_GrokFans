"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import {
  getWagmiAdapter,
  getWagmiConfig,
  getMetadata,
  activeChain,
  networks,
} from "@/lib/reown";
import { REOWN_PROJECT_ID } from "@/lib/config";
import { FEATURED_WALLET_IDS } from "@/lib/wallets";
import { useState, useEffect, useRef, type ReactNode } from "react";

const queryClient = new QueryClient();
let appKitInitialized = false;

function initAppKit() {
  if (appKitInitialized || typeof window === "undefined" || !REOWN_PROJECT_ID) {
    return;
  }

  appKitInitialized = true;
  const adapter = getWagmiAdapter();

  createAppKit({
    adapters: [adapter],
    projectId: REOWN_PROJECT_ID,
    networks: [...networks],
    defaultNetwork: activeChain,
    metadata: getMetadata(),
    featuredWalletIds: [...FEATURED_WALLET_IDS],
    enableEIP6963: true,
    enableMobileFullScreen: true,
    enableInjected: true,
    enableWalletConnect: true,
    allWallets: "SHOW",
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#00ffff",
      "--w3m-color-mix": "#0d1117",
      "--w3m-color-mix-strength": 40,
      "--w3m-border-radius-master": "16px",
    },
    features: {
      analytics: false,
    },
  });
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      initAppKit();
    } catch (error) {
      console.error("Failed to initialize Reown AppKit:", error);
    }

    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-brilliant-black" aria-busy="true" />;
  }

  if (!REOWN_PROJECT_ID) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
