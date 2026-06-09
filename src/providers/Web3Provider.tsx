"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { createWagmiConfig } from "@/lib/wagmi";
import { useState, useEffect, type ReactNode } from "react";

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    setConfig(createWagmiConfig());
  }, []);

  if (!config) {
    return <div className="min-h-screen bg-brilliant-black" aria-busy="true" />;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
