import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID ?? 97);
const CONTRACT =
  process.env.NEXT_PUBLIC_GROKFANS_CONTRACT ??
  "0x91c0f0D5dB7f63BCC5f20259C1b6EF5ee90d81Ca";
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY ?? "";

export const revalidate = 60;

async function fetchHolderCount(): Promise<number | null> {
  if (!BSCSCAN_API_KEY) return null;

  const params = new URLSearchParams({
    chainid: String(CHAIN_ID),
    module: "token",
    action: "tokenholdercount",
    contractaddress: CONTRACT,
    apikey: BSCSCAN_API_KEY,
  });

  const res = await fetch(
    `https://api.etherscan.io/v2/api?${params.toString()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== "1" || !data.result) return null;

  const count = parseInt(String(data.result), 10);
  return Number.isNaN(count) ? null : count;
}

export async function GET() {
  let totalFans = 0;

  const supabase = createServerClient();
  if (supabase) {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    totalFans = count ?? 0;
  }

  let holders: number | null = null;
  try {
    holders = await fetchHolderCount();
  } catch {
    holders = null;
  }

  return NextResponse.json({
    totalFans,
    holders,
    offline: !supabase,
  });
}
