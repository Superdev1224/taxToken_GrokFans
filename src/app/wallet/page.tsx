"use client";

import { useAccount } from "wagmi";
import { useGrokFans } from "@/hooks/useGrokFans";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { GROKFANS_CONTRACT, CHAIN_ID } from "@/lib/config";
import { truncateAddress } from "@/lib/utils";
import { Wallet, ExternalLink } from "lucide-react";

export default function WalletPage() {
  const { address, isConnected, connector } = useAccount();
  const { balanceFormatted, name, symbol, decimals, isLoading } =
    useGrokFans();

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Wallet className="mb-4 h-12 w-12 text-neon-cyan/50" />
        <h1 className="mb-2 text-2xl font-bold text-white">My Wallet</h1>
        <p className="mb-6 max-w-sm text-white/50">
          Connect your wallet to view your Flow balance and token details.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">My Wallet</h1>
        <p className="text-sm text-white/40">
          Your balance and token details on BNB Smart Chain
        </p>
      </div>

      <GlassCard glow className="relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-neon-cyan/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wider text-neon-cyan/70">
            Token Balance
          </p>
          <p className="mt-1 text-3xl font-bold text-neon-cyan text-glow-cyan sm:text-4xl">
            {isLoading ? "..." : `${balanceFormatted} ${symbol}`}
          </p>
          <p className="mt-2 text-xs text-white/40">
            Live on-chain balance — includes holder reflections
          </p>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan">
            Wallet
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Address</span>
            <span className="font-mono text-sm text-white/70">
              {truncateAddress(address, 6)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Connected via</span>
            <span className="text-sm text-white/70">
              {connector?.name ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Network</span>
            <span className="text-sm text-white/70">
              BSC {CHAIN_ID === 56 ? "Mainnet" : "Testnet"}
            </span>
          </div>
        </GlassCard>

        <GlassCard variant="gold" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-gold">
            Token
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Name</span>
            <span className="text-sm text-white/70">{name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Symbol</span>
            <span className="text-sm text-white/70">{symbol}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Decimals</span>
            <span className="text-sm text-white/70">{decimals}</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">Contract</p>
          <p className="font-mono text-sm text-white/70">
            {truncateAddress(GROKFANS_CONTRACT, 8)}
          </p>
        </div>
        <a
          href={`https://${CHAIN_ID === 56 ? "bscscan" : "testnet.bscscan"}.com/address/${GROKFANS_CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyan flex items-center gap-2 text-xs"
        >
          View on BscScan
          <ExternalLink className="h-3 w-3" />
        </a>
      </GlassCard>
    </div>
  );
}
