"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Copy, Check, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { cn } from "@/lib/utils";

type Props = {
  link: string;
  code: string | null;
  loading?: boolean;
};

async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ReferralLink({ link, code, loading = false }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const isReady = Boolean(link) && !loading;

  useEffect(() => {
    if (showQr && qrRef.current) {
      qrRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showQr]);

  const copy = async () => {
    if (!link) return;
    const ok = await copyToClipboard(link);
    if (ok) {
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } else {
      setCopyError(true);
    }
  };

  const toggleQr = () => {
    if (!isReady) return;
    setShowQr((prev) => !prev);
  };

  const shareMessage = "Join Flow — earn Builder & Leader rewards on BNB Smart Chain!";

  const shareOnX = () => {
    if (!link) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareMessage}\n${link}`)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  const shareOnTelegram = () => {
    if (!link) return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan">
            Your Referral Link
          </h3>
          <button
            type="button"
            onClick={toggleQr}
            disabled={!isReady}
            aria-label={showQr ? "Hide QR code" : "Show QR code"}
            aria-pressed={showQr}
            className={cn(
              "rounded-lg border border-neon-cyan/40 p-1.5 text-neon-cyan transition-all hover:bg-neon-cyan/10 disabled:cursor-not-allowed disabled:opacity-40",
              showQr && "bg-neon-cyan/20 shadow-glow-cyan"
            )}
          >
            <QrCode className="h-4 w-4" />
          </button>
        </div>
        {code && (
          <span className="rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1 font-mono text-xs text-neon-cyan">
            {code}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-3">
        <p className="flex-1 truncate font-mono text-sm text-white/70">
          {loading ? "Generating link…" : link || "Connect wallet to get your link"}
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={!isReady}
          className="shrink-0 rounded-lg p-2 text-neon-cyan transition-colors hover:bg-neon-cyan/10 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={shareOnX}
          disabled={!isReady}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>
        <button
          type="button"
          onClick={shareOnTelegram}
          disabled={!isReady}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#229ED9]/40 bg-[#229ED9]/10 py-2.5 text-sm font-medium text-[#229ED9] transition-all hover:border-[#229ED9]/60 hover:bg-[#229ED9]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Telegram
        </button>
      </div>

      {copyError && (
        <p className="text-center text-xs text-neon-amber">
          Could not copy link. Long-press the link above to copy manually.
        </p>
      )}

      {showQr && (
        <div
          ref={qrRef}
          className="flex flex-col items-center gap-3 rounded-lg border border-neon-cyan/20 bg-white p-5"
        >
          {link ? (
            <>
              <QRCodeCanvas
                value={link}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <p className="max-w-full truncate font-mono text-[10px] text-black/50">
                {link}
              </p>
            </>
          ) : (
            <p className="py-8 text-sm text-black/50">Generating link…</p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
