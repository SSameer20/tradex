import { cache } from "./redis";

export async function fetchCoinPrices() {
  const res = await fetch("/api/price", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchTopGainers() {
  const res = await fetch("/api/price/gainer", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchChartDetailsById(id: string) {
  const res = await fetch(`/api/coin/${id}/chart`);
  if (!res.ok) throw new Error("Failed to fetch chart data");
  return res.json();
}

export async function fetchCoinDetailsById(id: string) {
  const res = await fetch(`api/coin/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchUserPortfolioDetails() {
  const res = await fetch(`api/portfolio`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchTopLosers() {
  const res = await fetch("/api/price/loser", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function setLoserAndGainer(
  data: Record<
    string,
    {
      name: (typeof SYMBOLS)[keyof typeof SYMBOLS];
      usd: number;
      usd_24h_change: number;
    }
  >
) {
  const entries = Object.entries(data);

  // Sort by usd_24h_change ascending (negative → positive)
  const sorted = entries.sort(
    ([, a], [, b]) => a.usd_24h_change - b.usd_24h_change
  );
  // Losers: first 3 (lowest change)
  const losers = sorted.slice(0, 3).map(([key, value]) => ({
    key,
    ...value,
  }));
  // console.log("Top Losers:", losers);

  // Gainers: last 3 (highest change)
  const gainers = sorted
    .slice(-3)
    .reverse()
    .map(([key, value]) => ({
      key,
      ...value,
    }));

  console.log("Top Gainers:", gainers);
  // cache.set("gainers", gainers);
  // cache.set("losers", losers);
  return { gainers, losers };
}

export const SYMBOLS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  "usd-coin": "USDC",
  monero: "XMR",
  solana: "SOL",
  "matic-network": "MATIC", // Layer 2 scaling
  "avalanche-2": "AVAX", // High-speed L1
  polkadot: "DOT", // Interoperability chain
  cardano: "ADA", // Large community, staking chain
};

export const symbol_images: {
  [key in keyof typeof SYMBOLS | "default"]: string;
} = {
  bitcoin: "/images/bitcoin.png",
  ethereum: "/images/ethereum.png",
  tether: "/images/usdt.png",
  "usd-coin": "/images/usd-coin.png",
  monero: "/images/monero.png",
  solana: "/images/solana.png",
  "matic-network": "/images/polygon.png",
  "avalanche-2": "/images/avalanche.png",
  polkadot: "/images/polkadot.png",
  cardano: "/images/cardano.png",
  default: "/images/placeholder.png",
};

export const coin_images = (name: string) => {
  return (
    symbol_images[name as keyof typeof symbol_images] || symbol_images.default
  );
};

export const features = [
  {
    title: "Real-time Data",
    desc: "Get the latest market trends and insights instantly.",
  },
  {
    title: "Portfolio Tracking",
    desc: "Manage all your assets in one powerful dashboard.",
  },
  {
    title: "Secure ",
    desc: "Your data stays safe while you stay in control.",
  },
];
