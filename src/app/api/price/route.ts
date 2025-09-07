// app/api/prices/route.ts
import { NextResponse } from "next/server";
import { cache } from "@/lib/redis";
import { setLoserAndGainer, SYMBOLS } from "@/lib/helper";

export async function GET() {
  try {
    const cached = cache.get("prices");
    if (cached) {
      console.log("Returning cached prices");
      return NextResponse.json(cached);
    }

    // Fetch from CoinGecko

    const ids = Object.keys(SYMBOLS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, {
      headers: {
        "x-cg-demo-api-key": process.env.COINGECKO_API as string,
      },
      next: { revalidate: 30 },
    });
    const data = await res.json();
    console.log("Fetched prices from CoinGecko:", data);
    cache.set("prices", data);

    // Format
    const formatted: Record<
      string,
      {
        name: (typeof SYMBOLS)[keyof typeof SYMBOLS];
        usd: number;
        usd_24h_change: number;
      }
    > = {};
    for (const [id, val] of Object.entries<any>(data)) {
      const symbol = SYMBOLS[id as keyof typeof SYMBOLS];
      formatted[symbol] = {
        name: symbol,
        usd: val.usd,
        usd_24h_change: val.usd_24h_change,
      };
    }
    setLoserAndGainer(formatted);
    // ...existing code...

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
