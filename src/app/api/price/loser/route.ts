import { NextResponse } from "next/server";
import { cache } from "@/lib/redis";
import { setLoserAndGainer, SYMBOLS } from "@/lib/helper";
export async function GET() {
  // Check Redis cache
  const cached = cache.get("losers");
  if (cached) {
    console.log("Returning cached losers");
    const { losers } = setLoserAndGainer(cached);
    return NextResponse.json(losers.slice(0, 3));

    // return NextResponse.json(cached.slice(0, 3));
  }
  const ids = Object.keys(SYMBOLS).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("Fetched prices from CoinGecko:", data);
  cache.set("prices", data);
  const { losers } = setLoserAndGainer(data);

  return NextResponse.json(losers);
}
