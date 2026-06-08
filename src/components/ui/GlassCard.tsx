import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "cyan" | "gold";
  glow?: boolean;
};

export function GlassCard({
  children,
  className,
  variant = "cyan",
  glow = false,
}: Props) {
  return (
    <div
      className={cn(
        variant === "gold" ? "glass-panel-gold" : "glass-panel",
        glow && (variant === "gold" ? "shadow-glow-gold" : "shadow-glow-cyan"),
        "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
