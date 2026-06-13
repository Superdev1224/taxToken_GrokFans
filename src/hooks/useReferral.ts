"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { generateReferralCode } from "@/lib/utils";
import { useAppUrl } from "@/hooks/useAppUrl";
import {
  registerWallet,
  fetchReferrals,
  fetchRewards,
  type RewardsResult,
  type ReferralsResult,
} from "@/lib/referralApi";

const REF_KEY = "grokfans_ref";

export function useReferral() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const appUrl = useAppUrl();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardsResult | null>(null);
  const [referrals, setReferrals] = useState<ReferralsResult | null>(null);
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
      const data = await registerWallet(address, parentCode);
      setReferralCode(data.referralCode ?? generateReferralCode(address));
    } catch {
      setReferralCode(generateReferralCode(address));
    } finally {
      setLoading(false);
    }
  }, [address]);

  const fetchData = useCallback(async () => {
    if (!address) return;

    try {
      const [rewardsRes, referralsRes] = await Promise.all([
        fetchRewards(address),
        fetchReferrals(address),
      ]);
      setRewards(rewardsRes);
      setReferrals(referralsRes);
    } catch {
      // Keep previous data on transient failures
    }
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
