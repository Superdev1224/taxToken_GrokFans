"use client";

import {
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/utils";
import { CHAIN_ID } from "@/lib/config";
import { activeChain } from "@/lib/wagmi";
import { isMobileDevice, isInWalletInAppBrowser } from "@/lib/wallets";
import { MobileWalletPrompt } from "@/components/wallet/MobileWalletPrompt";
import { Wallet, LogOut, AlertTriangle } from "lucide-react";

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const chainId = useChainId();

  const wrongNetwork = isConnected && chainId !== CHAIN_ID;
  const showMobileHint =
    isMobileDevice() && !isConnected && !isInWalletInAppBrowser();

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={() => {
              switchChain({ chainId: activeChain.id });
            }}
            disabled={switching}
            className="hidden items-center gap-1 rounded-lg border border-neon-amber/50 bg-neon-amber/10 px-2 py-1 text-xs text-neon-amber sm:flex"
          >
            <AlertTriangle className="h-3 w-3" />
            {switching ? "Switching..." : "Switch Network"}
          </button>
        )}
        <button
          type="button"
          onClick={() => open({ view: "Account" })}
          className="glass-panel flex items-center gap-2 px-3 py-2 transition-colors hover:bg-white/[0.06]"
        >
          <div className="h-2 w-2 rounded-full bg-neon-cyan shadow-glow-cyan" />
          <span className="hidden font-mono text-sm text-white sm:inline">
            {truncateAddress(address)}
          </span>
          {connector?.name && (
            <span className="text-[10px] text-white/30 sm:hidden">
              {connector.name}
            </span>
          )}
        </button>
        <button
          onClick={handleDisconnect}
          className="rounded-lg border border-white/10 p-2 text-white/50 transition-colors hover:border-red-500/50 hover:text-red-400"
          aria-label="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => open()}
        className="flex items-center gap-2 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2.5 text-sm font-semibold text-neon-cyan transition-all hover:border-neon-cyan/70 hover:bg-neon-cyan/15 hover:shadow-glow-cyan active:scale-[0.98]"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
      {showMobileHint && <MobileWalletPrompt className="max-w-[280px]" />}
    </div>
  );
}
