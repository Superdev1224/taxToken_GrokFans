"use client";

import { useState } from "react";
import {
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { truncateAddress } from "@/lib/utils";
import { CHAIN_ID } from "@/lib/config";
import { activeChain } from "@/lib/wagmi";
import { WalletModal } from "@/components/wallet/WalletModal";
import { Wallet, LogOut, AlertTriangle } from "lucide-react";

export function ConnectButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const chainId = useChainId();

  const wrongNetwork = isConnected && chainId !== CHAIN_ID;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={() => switchChain({ chainId: activeChain.id })}
            disabled={switching}
            className="hidden items-center gap-1 rounded-lg border border-neon-amber/50 bg-neon-amber/10 px-2 py-1 text-xs text-neon-amber sm:flex"
          >
            <AlertTriangle className="h-3 w-3" />
            {switching ? "Switching..." : "Switch Network"}
          </button>
        )}
        <div className="glass-panel flex items-center gap-2 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-neon-cyan shadow-glow-cyan" />
          <span className="hidden font-mono text-sm text-white sm:inline">
            {truncateAddress(address)}
          </span>
          {connector?.name && (
            <span className="text-[10px] text-white/30 sm:hidden">
              {connector.name}
            </span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="rounded-lg border border-white/10 p-2 text-white/50 transition-colors hover:border-red-500/50 hover:text-red-400"
          aria-label="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="btn-cyan flex items-center gap-2 text-sm"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
