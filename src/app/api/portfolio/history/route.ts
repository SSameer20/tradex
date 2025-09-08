// app/api/user/portfolio/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // <- make sure you have this configured

export async function GET() {
  // 1. Get session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // 2. Resolve user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        trades: true,
      },
    });

    if (!user || !user.trades) {
      return NextResponse.json({ error: "Trades not found" }, { status: 404 });
    }

    const userTradeDetails = user.trades.map((item) => ({
      symbol: item.symbol,
      quantity: item.amount,
      type: item.type,
      price: item.priceUsd,
      value: item.priceUsd * item.amount,
      date: item.createdAt,
    }));

    // 4. Compute portfolio value

    // 5. Response
    return NextResponse.json(userTradeDetails);
  } catch (error) {
    console.error("Error in GET /api/portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
