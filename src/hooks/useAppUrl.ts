"use client";

import { useEffect, useState } from "react";
import { APP_URL } from "@/lib/config";

/** Uses the live browser origin on Vercel/local; falls back to APP_URL during SSR. */
export function useAppUrl(): string {
  const [url, setUrl] = useState(APP_URL);

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return url;
}
