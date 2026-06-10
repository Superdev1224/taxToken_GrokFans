"use client";

import { Suspense } from "react";
import { useAccount } from "wagmi";
import { useGrokFans } from "@/hooks/useGrokFans";
import { useReferral } from "@/hooks/useReferral";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { Gift, Hammer, Crown, Coins } from "lucide-react";

function RewardsContent() {
  const { isConnected } = useAccount();
  const { symbol, builderFee, leaderFee, holderFee } = useGrokFans();
  const { rewards } = useReferral();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gift className="mb-4 h-12 w-12 text-neon-cyan/50" />
        <h1 className="mb-2 text-2xl font-bold text-white">Claim Rewards</h1>
        <p className="mb-6 max-w-sm text-white/50">
          Connect your wallet to view your Builder, Leader and Holder rewards.
        </p>
        <ConnectButton />
      </div>
    );
  }

  const builderReward = rewards?.builder?.toFixed(2) ?? "0.00";
  const leaderReward = rewards?.leader?.toFixed(2) ?? "0.00";
  const holderReward = rewards?.holder?.toFixed(2) ?? "0.00";
  const totalReward = rewards?.total?.toFixed(2) ?? "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Claim Rewards
        </h1>
        <p className="text-sm text-white/40">
          Your earnings across all reward tiers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RewardCard
          title="Builder Rewards"
          value={`${builderReward} ${symbol}`}
          subtitle={`${builderFee}% of referred trade volume`}
          icon={Hammer}
          variant="gold"
        />
        <RewardCard
          title="Leader Rewards"
          value={`${leaderReward} ${symbol}`}
          subtitle={`${leaderFee}% from your network`}
          icon={Crown}
          variant="gold"
        />
        <RewardCard
          title="Holder Rewards"
          value={`${holderReward} ${symbol}`}
          subtitle={`${holderFee}% reflection on all holders`}
          icon={Coins}
          variant="cyan"
        />
      </div>

      <GlassCard variant="gold" glow className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-neon-gold/70">
              Available to Claim
            </p>
            <p className="mt-1 text-3xl font-bold text-neon-gold text-glow-gold">
              {totalReward} {symbol}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neon-gold/30 bg-neon-gold/10">
            <Gift className="h-7 w-7 text-neon-gold" />
          </div>
        </div>
        <button
          disabled
          className="btn-gold w-full opacity-40 disabled:cursor-not-allowed"
        >
          Claim {totalReward} {symbol}
        </button>
        <p className="text-center text-xs text-white/30">
          On-chain claiming is coming soon. Builder & Leader payouts are
          currently distributed automatically by the contract.
        </p>
      </GlassCard>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-neon-cyan">
          Loading...
        </div>
      }
    >
      <RewardsContent />
    </Suspense>
  );
}
