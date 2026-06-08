"use client";

import { useAccount } from "wagmi";
import { ReferralTree } from "@/components/tree/ReferralTree";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { GitBranch } from "lucide-react";

export default function TreePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GitBranch className="mb-4 h-12 w-12 text-neon-cyan/50" />
        <h1 className="mb-2 text-2xl font-bold text-white">Referral Tree</h1>
        <p className="mb-6 max-w-sm text-white/50">
          Connect your wallet to view the network of holders you have onboarded.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Referral Tree
        </h1>
        <p className="text-sm text-white/40">
          Visualize your downline network
        </p>
      </div>
      <ReferralTree wallet={address} />
    </div>
  );
}
