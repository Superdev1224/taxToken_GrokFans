import { GlassCard } from "@/components/ui/GlassCard";
import { FEE_SPLIT } from "@/lib/config";

type Props = {
  builderFee: number;
  leaderFee: number;
  holderFee: number;
};

export function FeeBreakdown({ builderFee, leaderFee, holderFee }: Props) {
  const tiers = [
    { label: "Builder", pct: builderFee, color: "bg-neon-gold", text: "text-neon-gold" },
    { label: "Leader", pct: leaderFee, color: "bg-neon-amber", text: "text-neon-amber" },
    { label: "Holders", pct: holderFee, color: "bg-neon-cyan", text: "text-neon-cyan" },
  ];

  return (
    <GlassCard>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
        Tax Protocol — {FEE_SPLIT.total}% Total
      </h3>
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-white/5">
        {tiers.map((t) => (
          <div
            key={t.label}
            className={t.color}
            style={{ width: `${t.pct}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((t) => (
          <div key={t.label} className="text-center">
            <p className={`text-xl font-bold ${t.text}`}>{t.pct}%</p>
            <p className="text-xs text-white/40">{t.label}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
