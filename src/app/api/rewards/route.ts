import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")?.toLowerCase();

  if (!wallet) {
    return NextResponse.json({ error: "Wallet required" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({
      builder: 0,
      leader: 0,
      holder: 0,
      total: 0,
      offline: true,
    });
  }

  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .eq("wallet_address", wallet);

  const totals: Record<"builder" | "leader" | "holder", number> = {
    builder: 0,
    leader: 0,
    holder: 0,
  };

  for (const r of rewards ?? []) {
    const tier = r.tier as "builder" | "leader" | "holder";
    if (tier in totals) {
      totals[tier] += Number(r.amount_token);
    }
  }

  return NextResponse.json({
    ...totals,
    total: totals.builder + totals.leader + totals.holder,
    items: rewards ?? [],
  });
}
