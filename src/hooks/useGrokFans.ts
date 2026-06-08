"use client";

import { useReadContracts, useAccount } from "wagmi";
import { grokfansAbi } from "@/lib/abi/grokfans";
import { GROKFANS_CONTRACT } from "@/lib/config";
import { formatTokenAmount } from "@/lib/utils";

export function useGrokFans() {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "name",
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "symbol",
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "decimals",
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "_builderFee",
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "_leaderFee",
      },
      {
        address: GROKFANS_CONTRACT,
        abi: grokfansAbi,
        functionName: "_reflectionFee",
      },
    ],
    query: { enabled: true },
  });

  const balance = data?.[0]?.result as bigint | undefined;
  const name = data?.[1]?.result as string | undefined;
  const symbol = data?.[2]?.result as string | undefined;
  const decimals = (data?.[3]?.result as number | undefined) ?? 18;
  const builderFee = Number(data?.[4]?.result ?? BigInt(10));
  const leaderFee = Number(data?.[5]?.result ?? BigInt(3));
  const holderFee = Number(data?.[6]?.result ?? BigInt(2));

  return {
    balance,
    balanceFormatted: balance ? formatTokenAmount(balance, decimals) : "0",
    name: name ?? "GrokFANS",
    symbol: symbol ?? "Grok2",
    decimals,
    builderFee,
    leaderFee,
    holderFee,
    isLoading,
    refetch,
  };
}
