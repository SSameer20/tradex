// app/api/prices/route.ts
import { NextResponse } from "next/server";
import { cache } from "@/lib/redis";
import { setLoserAndGainer, SYMBOLS } from "@/lib/helper";

export async function GET() {
  // Check Redis cache
  const cached = cache.get("prices");
  if (cached) {
    console.log("Returning cached prices");
    return NextResponse.json(cached);
  }

  // Fetch from CoinGecko

  const ids = Object.keys(SYMBOLS).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("Fetched prices from CoinGecko:", data);
  cache.set("prices", data);
  setLoserAndGainer(data);

  // Format
  const formatted: Record<string, any> = {};
  for (const [id, val] of Object.entries<any>(data)) {
    const symbol = SYMBOLS[id as keyof typeof SYMBOLS];
    formatted[symbol] = {
      price: val.usd,
      change_24h: val.usd_24h_change,
      last_updated: Date.now(),
    };
  }
  // ...existing code...

  // Save to Redis (TTL 45s)
  //   await redis.set("prices", JSON.stringify(formatted), "EX", 45);

  return NextResponse.json(formatted);
}
