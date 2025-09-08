// app/api/prices/route.ts
import { NextResponse } from "next/server";
// import { cache } from "@/lib/redis";
import { setLoserAndGainer, SYMBOLS } from "@/lib/helper";

export async function GET() {
  try {
    // const cached = cache.get("prices");
    // if (cached) {
    //   console.log("Returning cached prices");
    //   return NextResponse.json(cached);
    // }

    // Fetch from CoinGecko
    const ids = Object.keys(SYMBOLS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const res = await fetch(url, {
      headers: {
        "x-cg-demo-api-key": process.env.COINGECKO_API as string,
      },
      // ISR / cache control
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko fetch failed with status ${res.status}`);
    }

    const data: Record<string, { usd: number; usd_24h_change: number }> =
      await res.json();

    // cache.set("prices", data);

    // Format response
    const formatted: Record<
      string,
      {
        name: string;
        usd: number;
        usd_24h_change: number;
      }
    > = {};

    for (const [id, val] of Object.entries(data)) {
      const symbol = id as keyof typeof SYMBOLS;
      formatted[symbol] = {
        name: SYMBOLS[symbol], // ✅ use symbol mapping (BTC, ETH, etc.)
        usd: val.usd,
        usd_24h_change: val.usd_24h_change,
      };
    }

    setLoserAndGainer(formatted);

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error in GET /api/prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
