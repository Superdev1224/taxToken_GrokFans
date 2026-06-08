import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateReferralCode } from "@/lib/utils";

function normalizeWallet(wallet: string): string {
  return wallet.toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const wallet = normalizeWallet(body.wallet as string);
    const parentCode = body.parentCode as string | undefined;

    if (!wallet || !/^0x[a-f0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({
        wallet,
        referralCode: generateReferralCode(wallet),
        parentWallet: null,
        offline: true,
      });
    }

    const referralCode = generateReferralCode(wallet);

    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", wallet)
      .single();

    if (!existing) {
      await supabase.from("users").insert({
        wallet_address: wallet,
        referral_code: referralCode,
      });
    }

    let parentWallet: string | null = null;

    if (parentCode) {
      const { data: parent } = await supabase
        .from("users")
        .select("wallet_address")
        .eq("referral_code", parentCode)
        .single();

      if (parent) {
        parentWallet = parent.wallet_address;

        if (parentWallet !== wallet) {
          const { data: existingReferral } = await supabase
            .from("referrals")
            .select("id")
            .eq("child_wallet", wallet)
            .single();

          if (!existingReferral) {
            await supabase.from("referrals").insert({
              child_wallet: wallet,
              parent_wallet: parentWallet,
            });
          }
        }
      }
    }

    return NextResponse.json({
      wallet,
      referralCode: existing?.referral_code ?? referralCode,
      parentWallet,
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
