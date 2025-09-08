import { cache } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: coinId } = await context.params;

  try {
    const cacheData = cache.get(`price-${coinId}`);
    if (cacheData) {
      console.log(`Cache hit for ${coinId}`, cacheData);
      return NextResponse.json({ data: cacheData });
    }

    console.log(`Cache miss for ${coinId}, fetching from Coingecko...`);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coinId}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("API response:", data);

    if (!data[coinId] || data[coinId].usd === undefined) {
      throw new Error(`Unexpected response format for ${coinId}`);
    }

    const priceData = { usd: data[coinId].usd };

    // Save to cache
    cache.set(`price-${coinId}`, priceData);

    return NextResponse.json({ data: priceData });
  } catch (error) {
    console.error("Coin fetch error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
