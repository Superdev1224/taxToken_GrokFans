import { GlassCard } from "@/components/ui/GlassCard";
import { Heart, Users } from "lucide-react";

type Props = {
  totalFans: number;
  holders: number | null;
  loading?: boolean;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function CommunityStats({ totalFans, holders, loading }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <GlassCard glow className="relative overflow-hidden">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-neon-cyan/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10">
            <Heart className="h-5 w-5 text-neon-cyan" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neon-cyan/70">
              Total Members
            </p>
            <p className="text-2xl font-bold text-neon-cyan text-glow-cyan">
              {loading ? "…" : formatCount(totalFans)}
            </p>
            <p className="text-[10px] text-white/30">Registered on DApp</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="gold" glow className="relative overflow-hidden">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-neon-gold/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-gold/30 bg-neon-gold/10">
            <Users className="h-5 w-5 text-neon-gold" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neon-gold/70">
              Holders
            </p>
            <p className="text-2xl font-bold text-neon-gold text-glow-gold">
              {loading ? "…" : holders !== null ? formatCount(holders) : "—"}
            </p>
            <p className="text-[10px] text-white/30">On-chain wallets</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
