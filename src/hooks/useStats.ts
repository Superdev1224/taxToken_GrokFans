"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalFans: number;
  holders: number | null;
  offline?: boolean;
};

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: Stats) => setStats(data))
      .catch(() => setStats({ totalFans: 0, holders: null }))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
