"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { SidebarNav } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9998] lg:hidden",
        !open && "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute inset-y-0 left-0 flex w-64 flex-col overflow-y-auto border-r border-neon-cyan/20 bg-brilliant-black px-3 py-4 shadow-glow-cyan transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mb-4 flex items-center justify-between px-1">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-cyan/50 bg-neon-cyan/10">
              <span className="text-xs font-bold text-neon-cyan">GF</span>
            </div>
            <span className="text-base font-bold tracking-wide text-white">
              Grok<span className="text-neon-cyan text-glow-cyan">FANS</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarNav onNavigate={onClose} />
      </div>
    </div>,
    document.body
  );
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neon-cyan/20 bg-brilliant-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 shadow-glow-cyan">
            <span className="text-sm font-bold text-neon-cyan">GF</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            Grok<span className="text-neon-cyan text-glow-cyan">FANS</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-2 text-neon-cyan transition-colors hover:bg-neon-cyan/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ConnectButton />
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
