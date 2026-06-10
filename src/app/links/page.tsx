"use client";

import { Suspense } from "react";
import { useAccount } from "wagmi";
import { useReferral } from "@/hooks/useReferral";
import { ReferralLink } from "@/components/dashboard/ReferralLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { truncateAddress } from "@/lib/utils";
import { Link2, Users } from "lucide-react";

function LinksContent() {
  const { isConnected } = useAccount();
  const { referralLink, referralCode, referrals, loading } = useReferral();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Link2 className="mb-4 h-12 w-12 text-neon-cyan/50" />
        <h1 className="mb-2 text-2xl font-bold text-white">My Links</h1>
        <p className="mb-6 max-w-sm text-white/50">
          Connect your wallet to get your personal referral link and grow your
          network.
        </p>
        <ConnectButton />
      </div>
    );
  }

  const referralCount = referrals?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">My Links</h1>
        <p className="text-sm text-white/40">
          Share your referral link and track who you onboarded
        </p>
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
              {referrals.referrals.slice(0, 8).map((r) => (
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
    </div>
  );
}

export default function LinksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-neon-cyan">
          Loading...
        </div>
      }
    >
      <LinksContent />
    </Suspense>
  );
}
