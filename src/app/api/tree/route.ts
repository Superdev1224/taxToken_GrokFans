import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { TreeNode } from "@/lib/supabase/types";

async function buildTree(
  supabase: NonNullable<ReturnType<typeof createServerClient>>,
  wallet: string,
  depth = 0,
  maxDepth = 5
): Promise<TreeNode> {
  const { data: user } = await supabase
    .from("users")
    .select("referral_code")
    .eq("wallet_address", wallet)
    .single();

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

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")?.toLowerCase();

  if (!wallet) {
    return NextResponse.json({ error: "Wallet required" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({
      tree: { wallet, children: [], depth: 0 },
      offline: true,
    });
  }

  const tree = await buildTree(supabase, wallet);

  return NextResponse.json({ tree });
}
