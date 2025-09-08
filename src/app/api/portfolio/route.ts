// app/api/user/portfolio/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // <- make sure you have this configured

export async function GET() {
  try {
    // 1. Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Resolve user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        portfolio: {
          include: { holdings: true },
        },
      },
    });

    if (!user || !user.portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const priceRes = await fetch(`${baseUrl}/api/price`);

    if (!priceRes.ok) {
      throw new Error("Failed to fetch prices");
    }
    const prices = await priceRes.json();

    // 4. Compute portfolio value
    let portfolioValue = 0;
    const detailedHoldings = user.portfolio.holdings.map((h) => {
      const price = prices[h.symbol.toLowerCase()]?.usd || 0;
      const value = h.amount * price;
      portfolioValue += value;

      return {
        ...h,
        currentPrice: price,
        currentValue: value,
      };
    });

    // 5. Response
    return NextResponse.json({
      total: user.portfolio.totalBalance,
      value: portfolioValue,
      holdings: detailedHoldings,
      "24h_change": user.portfolio.change24h,
    });
  } catch (error) {
    console.error("Error in GET /api/portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
