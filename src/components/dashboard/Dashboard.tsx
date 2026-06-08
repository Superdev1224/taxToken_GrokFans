"use client";

import { useAccount } from "wagmi";
import { useGrokFans } from "@/hooks/useGrokFans";
import { useReferral } from "@/hooks/useReferral";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { ReferralLink } from "@/components/dashboard/ReferralLink";
import { FeeBreakdown } from "@/components/dashboard/FeeBreakdown";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import {
  Hammer,
  Crown,
  Coins,
  Users,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { GROKFANS_CONTRACT, CHAIN_ID } from "@/lib/config";
import { truncateAddress } from "@/lib/utils";

export function Dashboard() {
  const { isConnected } = useAccount();
  const {
    balanceFormatted,
    symbol,
    builderFee,
    leaderFee,
    holderFee,
    isLoading,
  } = useGrokFans();
  const { referralLink, referralCode, rewards, referrals, loading } =
    useReferral();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 animate-float">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-cyan/50 bg-neon-cyan/10 shadow-glow-cyan">
            <Wallet className="h-10 w-10 text-neon-cyan" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          Grok<span className="text-neon-cyan text-glow-cyan">FANS</span>{" "}
          Dashboard
        </h1>
        <p className="mb-8 max-w-md text-white/50">
          Connect your wallet to track Builder & Leader rewards, generate
          referral links, and grow your network on BNB Smart Chain.
        </p>
        <ConnectButton />
        <p className="mt-6 text-xs text-white/30">
          Optimized for Trust Wallet · BSC {CHAIN_ID === 56 ? "Mainnet" : "Testnet"}
        </p>
      </div>
    );
  }

  const builderReward = rewards?.builder?.toFixed(2) ?? "0.00";
  const leaderReward = rewards?.leader?.toFixed(2) ?? "0.00";
  const holderReward = rewards?.holder?.toFixed(2) ?? "0.00";
  const referralCount = referrals?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-white/40">
            Track rewards and grow your GrokFANS network
          </p>
        </div>
        <GlassCard className="!p-3">
          <p className="text-xs text-white/40">Balance</p>
          <p className="text-lg font-bold text-neon-cyan text-glow-cyan">
            {isLoading ? "..." : `${balanceFormatted} ${symbol}`}
          </p>
        </GlassCard>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <ReferralLink
          link={referralLink}
          code={loading ? null : referralCode}
          loading={loading}
        />

        <GlassCard className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-gold">
            Your Network
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neon-gold/30 bg-neon-gold/10">
              <Users className="h-7 w-7 text-neon-gold" />
            </div>
            <div>
              <p className="text-3xl font-bold text-neon-gold text-glow-gold">
                {referralCount}
              </p>
              <p className="text-sm text-white/40">Direct referrals</p>
            </div>
          </div>

          {referrals?.referrals && referrals.referrals.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wider text-white/30">
                Recent onboarded
              </p>
              {referrals.referrals.slice(0, 5).map((r) => (
                <div
                  key={r.child_wallet}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="font-mono text-xs text-white/70">
                    {truncateAddress(r.child_wallet, 6)}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <FeeBreakdown
        builderFee={builderFee}
        leaderFee={leaderFee}
        holderFee={holderFee}
      />

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
