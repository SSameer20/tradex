import { NextResponse } from "next/server";

import { setLoserAndGainer, SYMBOLS } from "@/lib/helper";
export async function GET() {
  // Check Redis cache
  // const cached = cache.get("gainers");
  // if (cached) {
  //   console.log("Returning cached gainers");
  //   const { gainers } = setLoserAndGainer(cached);
  //   return NextResponse.json(gainers.slice(0, 3));

  //   // return NextResponse.json(cached.slice(0, 3));
  // }

  const ids = Object.keys(SYMBOLS).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  const data = await res.json();

  // cache.set("prices", data);
  const { gainers } = setLoserAndGainer(data);

  return NextResponse.json(gainers.slice(0, 3));
}
