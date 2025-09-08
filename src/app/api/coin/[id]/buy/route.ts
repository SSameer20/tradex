import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { symbol, quantity } = body;
    const coinId = (await context.params).id;
    console.log("Buy request for:", { coinId, symbol, quantity });
    const userId = "clh1v5t1f0000l6l3p9g6nqz5"; // Hardcoded for testing

    if (!userId || !symbol || !quantity) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fetch coin price
    const coinPriceRes = await fetch(
      `http://localhost:3000/api/coin/${coinId}/chart`
    );

    const coinData = await coinPriceRes.json();
    const priceUsd = coinData.prices[coinData.prices.length - 1][1];

    const amount = parseFloat(quantity);
    const totalUsd = amount * priceUsd;

    const result = await prisma.$transaction(async (tx) => {
      // Get or create portfolio
      let portfolio = await tx.portfolio.findUnique({
        where: { userId },
        include: { holdings: true },
      });

      if (!portfolio) {
        portfolio = await tx.portfolio.create({
          data: {
            userId,
            totalBalance: 100000, // For testing
            totalValue: 0,
          },
          include: { holdings: true },
        });
      }

      if (portfolio.totalBalance < totalUsd)
        throw new Error("Insufficient balance");

      const updatedBalance = portfolio.totalBalance - totalUsd;

      // Update or create holding
      const existingHolding = portfolio.holdings.find(
        (h) => h.symbol === symbol
      );
      let holding;
      if (existingHolding) {
        holding = await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            amount: existingHolding.amount + amount,
            valueUsd: existingHolding.valueUsd + totalUsd,
          },
        });
      } else {
        holding = await tx.holding.create({
          data: {
            portfolioId: portfolio.id,
            symbol,
            amount,
            valueUsd: totalUsd,
          },
        });
      }

      // Update portfolio
      const updatedPortfolio = await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          totalBalance: updatedBalance,
          totalValue: portfolio.totalValue + totalUsd,
        },
      });

      // Record trade
      const trade = await tx.trade.create({
        data: {
          userId,
          symbol,
          type: "BUY",
          amount,
          priceUsd,
          totalUsd,
        },
      });

      return { portfolio: updatedPortfolio, holding, trade };
    });

    return NextResponse.json({ message: "Buy successful", ...result });
  } catch (err: any) {
    console.error("Buy error:", err);
    const status = err.message === "Insufficient balance" ? 400 : 500;
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status }
    );
  }
}
