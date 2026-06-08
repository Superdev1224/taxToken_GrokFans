import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: "cyan" | "gold";
};

export function RewardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "cyan",
}: Props) {
  const isGold = variant === "gold";

  return (
    <GlassCard variant={variant} glow className="relative overflow-hidden">
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl",
          isGold ? "bg-neon-gold/10" : "bg-neon-cyan/10"
        )}
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium uppercase tracking-wider",
              isGold ? "text-neon-gold/80" : "text-neon-cyan/80"
            )}
          >
            {title}
          </span>
          <Icon
            className={cn(
              "h-5 w-5",
              isGold ? "text-neon-gold" : "text-neon-cyan"
            )}
          />
        </div>
        <p
          className={cn(
            "text-2xl font-bold sm:text-3xl",
            isGold ? "text-neon-gold text-glow-gold" : "text-neon-cyan text-glow-cyan"
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-white/40">{subtitle}</p>
      </div>
    </GlassCard>
  );
}
