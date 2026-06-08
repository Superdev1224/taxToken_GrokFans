"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Copy, Check, Share2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  link: string;
  code: string | null;
};

export function ReferralLink({ link, code }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join GrokFANS",
        text: "Earn Builder & Leader rewards with GrokFANS!",
        url: link,
      });
    } else {
      copy();
    }
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan">
          Your Referral Link
        </h3>
        {code && (
          <span className="rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1 font-mono text-xs text-neon-cyan">
            {code}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-3">
        <p className="flex-1 truncate font-mono text-sm text-white/70">{link}</p>
        <button
          onClick={copy}
          className="shrink-0 rounded-lg p-2 text-neon-cyan transition-colors hover:bg-neon-cyan/10"
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
        <button onClick={share} className="btn-cyan flex flex-1 items-center justify-center gap-2 text-sm">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={() => setShowQr(!showQr)}
          className="btn-cyan flex items-center justify-center gap-2 px-4 text-sm"
        >
          <QrCode className="h-4 w-4" />
        </button>
      </div>

      {showQr && link && (
        <div className="flex justify-center rounded-lg border border-neon-cyan/20 bg-white p-4">
          <QRCodeSVG value={link} size={160} />
        </div>
      )}
    </GlassCard>
  );
}
