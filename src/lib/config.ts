export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID ?? 97);

export const GROKFANS_CONTRACT =
  (process.env.NEXT_PUBLIC_GROKFANS_CONTRACT as `0x${string}`) ??
  "0x4578c91c21b13ad42432e1A5D873555dF7Ba843a";

/** Fallback for SSR & Reown metadata. Referral links use window.location.origin on the client. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Reown (WalletConnect) project ID — get one at https://dashboard.reown.com */
export const REOWN_PROJECT_ID =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ??
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "";

/** @deprecated Use REOWN_PROJECT_ID */
export const WALLETCONNECT_PROJECT_ID = REOWN_PROJECT_ID;

export const BSC_RPC_URL =
  process.env.NEXT_PUBLIC_BSC_RPC_URL ??
  "https://bsc-testnet-rpc.publicnode.com";

export const FEE_SPLIT = {
  builder: 10,
  leader: 3,
  holder: 2,
  total: 15,
} as const;
