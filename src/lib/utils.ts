import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function generateReferralCode(wallet: string): string {
  const hash = wallet.slice(2, 10).toLowerCase();
  return `gf${hash}`;
}

export function formatTokenAmount(
  value: bigint,
  decimals = 18,
  maxFractionDigits = 4
): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .slice(0, maxFractionDigits)
    .replace(/0+$/, "");
  return fractionStr ? `${whole}.${fractionStr}` : whole.toString();
}
