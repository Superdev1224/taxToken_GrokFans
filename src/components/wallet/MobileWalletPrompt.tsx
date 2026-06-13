"use client";

import { useAccount } from "wagmi";
import {
  isMobileDevice,
  isInWalletInAppBrowser,
  MOBILE_WALLET_OPTIONS,
} from "@/lib/wallets";
import { Smartphone } from "lucide-react";

type Props = {
  className?: string;
};

/**
 * On mobile browsers, wallet extensions are not available.
 * Show direct "Open in app" links so installed wallets can connect via in-app browser.
 */
export function MobileWalletPrompt({ className }: Props) {
  const { isConnected } = useAccount();

  if (!isMobileDevice() || isConnected || isInWalletInAppBrowser()) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35">
        <Smartphone className="h-3 w-3 text-neon-cyan/60" />
        <span>Open in wallet app</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {MOBILE_WALLET_OPTIONS.map(({ key, name, open }) => (
          <button
            key={key}
            type="button"
            onClick={open}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-neon-cyan/30 hover:bg-neon-cyan/10 hover:text-neon-cyan"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
