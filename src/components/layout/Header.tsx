"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { cn } from "@/lib/utils";
import { LayoutDashboard, GitBranch } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tree", label: "Tree", icon: GitBranch },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neon-cyan/20 bg-brilliant-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 shadow-glow-cyan">
            <span className="text-sm font-bold text-neon-cyan">GF</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            Grok<span className="text-neon-cyan text-glow-cyan">FANS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-neon-cyan/10 text-neon-cyan"
                  : "text-white/60 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <ConnectButton />
      </div>

      <nav className="flex border-t border-neon-cyan/10 sm:hidden">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium",
              pathname === href
                ? "text-neon-cyan"
                : "text-white/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
