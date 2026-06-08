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
