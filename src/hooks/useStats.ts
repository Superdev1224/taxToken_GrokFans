"use client";

import { useEffect, useState } from "react";
import { fetchStats, type StatsResult } from "@/lib/referralApi";

export function useStats() {
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setStats({ totalFans: 0, holders: null }))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
