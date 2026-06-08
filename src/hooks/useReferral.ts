"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { generateReferralCode } from "@/lib/utils";
import { useAppUrl } from "@/hooks/useAppUrl";

const REF_KEY = "grokfans_ref";

type RegisterResponse = {
  wallet: string;
  referralCode: string;
  parentWallet: string | null;
  offline?: boolean;
};

type RewardsResponse = {
  builder: number;
  leader: number;
  holder: number;
  total: number;
  offline?: boolean;
};

type ReferralsResponse = {
  referrals: { child_wallet: string; created_at: string }[];
  count: number;
  offline?: boolean;
};

export function useReferral() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const appUrl = useAppUrl();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardsResponse | null>(null);
  const [referrals, setReferrals] = useState<ReferralsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem(REF_KEY, ref);
    }
  }, [searchParams]);

  const register = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const parentCode = localStorage.getItem(REF_KEY) ?? undefined;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, parentCode }),
      });
      const data: RegisterResponse = await res.json();
      setReferralCode(data.referralCode ?? generateReferralCode(address));
    } catch {
      setReferralCode(generateReferralCode(address));
    } finally {
      setLoading(false);
    }
  }, [address]);

  const fetchData = useCallback(async () => {
    if (!address) return;
    const wallet = address.toLowerCase();

    const [rewardsRes, referralsRes] = await Promise.all([
      fetch(`/api/rewards?wallet=${wallet}`),
      fetch(`/api/referrals?wallet=${wallet}`),
    ]);

    setRewards(await rewardsRes.json());
    setReferrals(await referralsRes.json());
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      register().then(fetchData);
    }
  }, [isConnected, address, register, fetchData]);

  const referralLink = referralCode
    ? `${appUrl}?ref=${referralCode}`
    : address
      ? `${appUrl}?ref=${generateReferralCode(address)}`
      : "";

  return {
    referralCode,
    referralLink,
    rewards,
    referrals,
    loading,
    refetch: fetchData,
  };
}
