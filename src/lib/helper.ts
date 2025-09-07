import { cache } from "./redis";

export async function fetchCoinPrices() {
  const res = await fetch("/api/price", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function setLoserAndGainer(data: Record<string, any>) {
  const entries = Object.entries(data);

  // Sort by usd_24h_change ascending (negative → positive)
  const sorted = entries.sort(
    ([, a], [, b]) => a.usd_24h_change - b.usd_24h_change
  );
  const gainers = sorted.reverse().slice(0, 3);
  const losers = sorted.slice(0, 3);

  cache.set("gainers", gainers);
  cache.set("losers", losers);
  return { gainers: gainers, losers: losers };
}

export const SYMBOLS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  "usd-coin": "USDC",
  monero: "XMR",
  solana: "SOL",
};

export const symbol_images: { [key in keyof typeof SYMBOLS]: string } = {
  bitcoin: "/images/bitcoin.png",
  ethereum: "/images/ethereum.png",
  tether: "/images/usdt.png",
  "usd-coin": "/images/usd-coin.png",
  monero: "/images/monero.png",
  solana: "/images/solana.png",
};
