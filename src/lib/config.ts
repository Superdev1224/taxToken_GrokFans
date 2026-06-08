export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID ?? 97);

export const GROKFANS_CONTRACT =
  (process.env.NEXT_PUBLIC_GROKFANS_CONTRACT as `0x${string}`) ??
  "0x91c0f0D5dB7f63BCC5f20259C1b6EF5ee90d81Ca";

/** Fallback for SSR / WalletConnect metadata. Referral links use window.location.origin on the client. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const BSC_RPC_URL =
  process.env.NEXT_PUBLIC_BSC_RPC_URL ??
  "https://bsc-testnet-rpc.publicnode.com";

export const FEE_SPLIT = {
  builder: 10,
  leader: 3,
  holder: 2,
  total: 15,
} as const;
