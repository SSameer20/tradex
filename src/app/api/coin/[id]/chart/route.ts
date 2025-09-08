import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cache } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const { id: coinId } = await context.params;

    const cacheData = cache.get(`chart-${coinId}`);
    if (cacheData) {
      return NextResponse.json(cacheData);
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
      { cache: "no-store" }
    );
    console.log("cache miss");
    if (!res.ok) throw new Error("Failed to fetch coin data");

    const data = await res.json();
    const change24h =
      ((data.prices[data.prices.length - 1][1] - data.prices[0][1]) /
        data.prices[0][1]) *
      100;

    cache.set(`chart-${coinId}`, {
      prices: data.prices,
      market_caps: data.market_caps,
      total_volumes: data.total_volumes,
      change24h: change24h,
    });

    return NextResponse.json({
      prices: data.prices,
      market_caps: data.market_caps,
      total_volumes: data.total_volumes,
      change24h: change24h,
    });
  } catch (error) {
    console.error("Coin fetch error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
