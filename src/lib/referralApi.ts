"use client";

/**
 * Client-side data layer for the static export build.
 * Talks to Supabase directly from the browser (anon key + RLS)
 * instead of going through Next.js API routes.
 */

import { createBrowserClient } from "@/lib/supabase/client";
import { generateReferralCode } from "@/lib/utils";
import type { Referral, Reward, TreeNode } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type RegisterResult = {
  wallet: string;
  referralCode: string;
  parentWallet: string | null;
  offline?: boolean;
};

export type RewardsResult = {
  builder: number;
  leader: number;
  holder: number;
  total: number;
  items?: Reward[];
  offline?: boolean;
};

export type ReferralsResult = {
  referrals: Pick<Referral, "child_wallet" | "created_at">[];
  count: number;
  offline?: boolean;
};

export type TreeResult = {
  tree: TreeNode;
  offline?: boolean;
};

export type StatsResult = {
  totalFans: number;
  holders: number | null;
  offline?: boolean;
};

export async function registerWallet(
  rawWallet: string,
  parentCode?: string
): Promise<RegisterResult> {
  const wallet = rawWallet.toLowerCase();
  const referralCode = generateReferralCode(wallet);

  const supabase = createBrowserClient();
  if (!supabase) {
    return { wallet, referralCode, parentWallet: null, offline: true };
  }

  const { data: existing } = await supabase
    .from("users")
    .select("referral_code")
    .eq("wallet_address", wallet)
    .maybeSingle();

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
      .maybeSingle();

    if (parent && parent.wallet_address !== wallet) {
      parentWallet = parent.wallet_address;

      const { data: existingReferral } = await supabase
        .from("referrals")
        .select("id")
        .eq("child_wallet", wallet)
        .maybeSingle();

      if (!existingReferral) {
        await supabase.from("referrals").insert({
          child_wallet: wallet,
          parent_wallet: parentWallet,
        });
      }
    }
  }

  return {
    wallet,
    referralCode: existing?.referral_code ?? referralCode,
    parentWallet,
  };
}

export async function fetchReferrals(
  rawWallet: string
): Promise<ReferralsResult> {
  const wallet = rawWallet.toLowerCase();

  const supabase = createBrowserClient();
  if (!supabase) {
    return { referrals: [], count: 0, offline: true };
  }

  const { data: referrals } = await supabase
    .from("referrals")
    .select("child_wallet, created_at")
    .eq("parent_wallet", wallet)
    .order("created_at", { ascending: false });

  return {
    referrals: referrals ?? [],
    count: referrals?.length ?? 0,
  };
}

export async function fetchRewards(rawWallet: string): Promise<RewardsResult> {
  const wallet = rawWallet.toLowerCase();

  const supabase = createBrowserClient();
  if (!supabase) {
    return { builder: 0, leader: 0, holder: 0, total: 0, offline: true };
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

  for (const r of (rewards ?? []) as Reward[]) {
    if (r.tier in totals) {
      totals[r.tier] += Number(r.amount_token);
    }
  }

  return {
    ...totals,
    total: totals.builder + totals.leader + totals.holder,
    items: (rewards ?? []) as Reward[],
  };
}

async function buildTree(
  supabase: SupabaseClient,
  wallet: string,
  depth = 0,
  maxDepth = 5
): Promise<TreeNode> {
  const { data: user } = await supabase
    .from("users")
    .select("referral_code")
    .eq("wallet_address", wallet)
    .maybeSingle();

  const { data: children } = await supabase
    .from("referrals")
    .select("child_wallet")
    .eq("parent_wallet", wallet);

  const childNodes: TreeNode[] = [];

  if (depth < maxDepth) {
    for (const child of children ?? []) {
      childNodes.push(
        await buildTree(supabase, child.child_wallet, depth + 1, maxDepth)
      );
    }
  }

  return {
    wallet,
    referralCode: user?.referral_code,
    children: childNodes,
    depth,
  };
}

export async function fetchTree(rawWallet: string): Promise<TreeResult> {
  const wallet = rawWallet.toLowerCase();

  const supabase = createBrowserClient();
  if (!supabase) {
    return { tree: { wallet, children: [], depth: 0 }, offline: true };
  }

  const tree = await buildTree(supabase, wallet);
  return { tree };
}

export async function fetchStats(): Promise<StatsResult> {
  const supabase = createBrowserClient();
  if (!supabase) {
    return { totalFans: 0, holders: null, offline: true };
  }

  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Holder count requires a paid block-explorer API plan; not available in the static build.
  return { totalFans: count ?? 0, holders: null };
}
