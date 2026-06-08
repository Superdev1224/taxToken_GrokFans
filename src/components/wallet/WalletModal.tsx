"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useConnect, type Connector } from "wagmi";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type WalletOption = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const WALLET_META: Record<string, Omit<WalletOption, "id">> = {
  metaMask: {
    name: "MetaMask",
    description: "Browser extension & mobile",
    icon: "🦊",
  },
  "io.metamask": {
    name: "MetaMask",
    description: "Browser extension & mobile",
    icon: "🦊",
  },
  trust: {
    name: "Trust Wallet",
    description: "Mobile — scan QR or in-app browser",
    icon: "🛡️",
  },
  "com.trustwallet.app": {
    name: "Trust Wallet",
    description: "Mobile — scan QR or in-app browser",
    icon: "🛡️",
  },
  walletConnect: {
    name: "WalletConnect",
    description: "200+ wallets — Rainbow, OKX, Bitget…",
    icon: "🔗",
  },
  coinbaseWalletSDK: {
    name: "Coinbase Wallet",
    description: "Extension & mobile app",
    icon: "🔵",
  },
  injected: {
    name: "Browser Wallet",
    description: "Brave, Rabby, TokenPocket, Binance…",
    icon: "🌐",
  },
};

const EXCLUDED_WALLETS = [
  "phantom",
  "tronlink",
  "tron",
  "solflare",
  "backpack",
  "keplr",
  "petra",
];

const DISPLAY_ORDER = [
  "metaMask",
  "trust",
  "walletConnect",
  "coinbaseWalletSDK",
  "injected",
];

function connectorKey(connector: Connector): string {
  return connector.id === "injected"
    ? `injected-${connector.name}`
    : connector.id;
}

function isExcluded(connector: Connector): boolean {
  const haystack = `${connector.id} ${connector.name}`.toLowerCase();
  return EXCLUDED_WALLETS.some((w) => haystack.includes(w));
}

function getWalletMeta(connector: Connector): WalletOption {
  const known = WALLET_META[connector.id] ?? WALLET_META[connector.name];
  const key = connectorKey(connector);
  if (known) return { id: key, ...known };

  return {
    id: key,
    name: connector.name,
    description: "Connect via browser extension",
    icon: "💼",
  };
}

function prepareConnectors(connectors: readonly Connector[]): Connector[] {
  const seen = new Set<string>();
  const filtered: Connector[] = [];

  for (const c of connectors) {
    if (isExcluded(c)) continue;
    const key = connectorKey(c);
    if (seen.has(key)) continue;
    seen.add(key);
    filtered.push(c);
  }

  return filtered.sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.id);
    const bi = DISPLAY_ORDER.indexOf(b.id);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WalletModal({ open, onClose }: Props) {
  const { connect, connectors, isPending } = useConnect();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const options = prepareConnectors(connectors);

  const handleConnect = (connector: Connector) => {
    const key = connectorKey(connector);
    setConnectingId(key);
    connect(
      { connector, chainId: undefined },
      {
        onSuccess: () => {
          setConnectingId(null);
          onClose();
        },
        onError: () => setConnectingId(null),
      }
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col rounded-2xl border border-neon-cyan/30 bg-brilliant-black shadow-glow-cyan">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2
              id="wallet-modal-title"
              className="text-lg font-bold text-white"
            >
              Connect Wallet
            </h2>
            <p className="text-sm text-white/40">
              Choose your preferred wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="wallet-modal-scroll max-h-[min(420px,60vh)] space-y-2 overflow-y-auto px-6 py-4">
          {options.map((connector) => {
            const meta = getWalletMeta(connector);
            const key = connectorKey(connector);
            const connecting = isPending && connectingId === key;

            return (
              <button
                key={key}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4",
                  "transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/5",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-2xl">
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-white">{meta.name}</p>
                  <p className="text-xs text-white/40">{meta.description}</p>
                </div>
                {connecting && (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-neon-cyan" />
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-center text-xs text-white/30">
            New to wallets?{" "}
            <a
              href="https://trustwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              Get Trust Wallet
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
