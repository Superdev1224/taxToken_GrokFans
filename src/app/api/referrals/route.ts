import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")?.toLowerCase();

  if (!wallet) {
    return NextResponse.json({ error: "Wallet required" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ referrals: [], count: 0, offline: true });
  }

  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("parent_wallet", wallet)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    referrals: referrals ?? [],
    count: referrals?.length ?? 0,
  });
}
