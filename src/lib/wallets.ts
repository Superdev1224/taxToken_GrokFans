import { CHAIN_ID } from "./config";

/** WalletConnect / Reown explorer IDs */
export const WALLET_IDS = {
  metamask: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  trust: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
  phantom: "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
  coinbase: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
} as const;

export const FEATURED_WALLET_IDS = [
  WALLET_IDS.metamask,
  WALLET_IDS.trust,
  WALLET_IDS.phantom,
  WALLET_IDS.coinbase,
];

/** Trust Wallet SLIP-0044 coin id for BNB Smart Chain */
const TRUST_BSC_COIN_ID = 20000714;

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isInWalletInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & {
    trustwallet?: unknown;
    phantom?: { ethereum?: unknown };
    ethereum?: { isMetaMask?: boolean; isTrust?: boolean };
  };
  if (w.trustwallet) return true;
  if (w.phantom?.ethereum) return true;
  if (w.ethereum?.isMetaMask || w.ethereum?.isTrust) return true;
  return /TrustWallet|MetaMaskMobile|Phantom/i.test(navigator.userAgent);
}

function getPageUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

function getDappPathForMetaMask(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/** Open the current page inside a wallet's in-app browser (mobile). */
export function openInTrustWallet(): void {
  const url = encodeURIComponent(getPageUrl());
  const coinId = CHAIN_ID === 56 ? TRUST_BSC_COIN_ID : 60;
  window.location.href = `https://link.trustwallet.com/open_url?coin_id=${coinId}&url=${url}`;
}

export function openInMetaMask(): void {
  const dappPath = getDappPathForMetaMask(getPageUrl());
  const link = `https://link.metamask.io/dapp/${dappPath}`;
  const a = document.createElement("a");
  a.href = link;
  a.target = "_self";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function openInPhantom(): void {
  const href = getPageUrl();
  const encodedHref = encodeURIComponent(href);
  const protocol = href.startsWith("https") ? "https" : "http";
  const host = href.split("/")[2] ?? "";
  const encodedRef = encodeURIComponent(`${protocol}://${host}`);

  if (isAndroid()) {
    window.location.href = `intent://browse/${encodedHref}?ref=${encodedRef}#Intent;scheme=phantom;package=app.phantom;end`;
    return;
  }

  window.location.href = `https://phantom.app/ul/browse/${encodedHref}?ref=${encodedRef}`;
}

export const MOBILE_WALLET_OPTIONS = [
  {
    key: "metamask",
    name: "MetaMask",
    open: openInMetaMask,
  },
  {
    key: "trust",
    name: "Trust Wallet",
    open: openInTrustWallet,
  },
  {
    key: "phantom",
    name: "Phantom",
    open: openInPhantom,
  },
] as const;
