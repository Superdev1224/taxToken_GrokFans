"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CHAIN_ID, GROKFANS_CONTRACT } from "@/lib/config";
import {
  LayoutDashboard,
  Wallet,
  Link2,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BSCSCAN_URL = `https://${
  CHAIN_ID === 56 ? "bscscan" : "testnet.bscscan"
}.com/address/${GROKFANS_CONTRACT}`;

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/wallet", label: "My Wallet", icon: Wallet },
    ],
  },
  {
    title: "Referrals",
    items: [
      { href: "/links", label: "My Links", icon: Link2 },
      { href: "/tree", label: "Tree View", icon: GitBranch },
    ],
  },
];

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex flex-1 flex-col gap-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-glow-cyan"
                        : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Community
          </p>
          <a
            href={BSCSCAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            BSCScan
          </a>
        </div>
      </nav>

      <div className="mt-auto px-1 pt-6">
        <div className="flex items-center gap-2 rounded-lg border border-neon-gold/30 bg-neon-gold/5 px-3 py-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-neon-gold shadow-glow-gold" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neon-gold">
            BNB Smart Chain
          </span>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-60 shrink-0 flex-col overflow-y-auto border-r border-neon-cyan/10 px-3 py-6 lg:flex">
      <SidebarNav />
    </aside>
  );
}
