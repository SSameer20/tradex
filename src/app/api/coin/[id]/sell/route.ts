import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface SellRequestBody {
  symbol: string;
  quantity: number;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("POST /sell called"); // Step 0
  const session = await getServerSession(authOptions);
  console.log("Session fetched:", session);

  if (!session) {
    console.log("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Step 1: Parse request body
    const body: SellRequestBody = await req.json();
    console.log("Request body:", body);

    const { symbol, quantity } = body;
    const { id: coinId } = await context.params;
    const userId = session.user.id;

    if (!userId || !symbol || !quantity) {
      console.log("Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Step 2: Fetch coin price
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) throw new Error("BASE_URL not defined");

    const coinPriceRes = await fetch(`${baseUrl}/api/coin/${coinId}/price`);
    if (!coinPriceRes.ok) {
      console.log("Failed to fetch coin price");
      return NextResponse.json(
        { error: "Failed to fetch coin price" },
        { status: 500 }
      );
    }

    const coinData = await coinPriceRes.json();
    const coinInfo = coinData.data;

    if (!coinInfo || coinInfo.usd === undefined) {
      console.log("Invalid coin data");
      return NextResponse.json({ error: "Invalid coin data" }, { status: 500 });
    }

    const priceUsd = coinInfo.usd;
    const amount = quantity;
    const totalUsd = priceUsd * quantity;
    console.log("Sell amount:", amount, "Total USD:", totalUsd);

    // Step 3: Transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("Starting sell DB transaction");

      const portfolio = await tx.portfolio.findUnique({
        where: { userId },
        include: { holdings: true },
      });

      if (!portfolio) {
        throw new Error("No portfolio found");
      }

      // Find holding
      const existingHolding = portfolio.holdings.find(
        (h) => h.symbol === symbol
      );

      if (!existingHolding) {
        throw new Error("No holdings for this coin");
      }

      if (existingHolding.amount < amount) {
        throw new Error("Insufficient coin quantity");
      }

      // Update holding
      let holding;
      if (existingHolding.amount === amount) {
        // Selling everything → delete holding
        console.log("Deleting holding since full amount sold");
        await tx.holding.delete({ where: { id: existingHolding.id } });
        holding = null;
      } else {
        console.log("Updating holding after partial sell");
        holding = await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            amount: existingHolding.amount - amount,
            valueUsd: existingHolding.valueUsd - totalUsd,
          },
        });
      }

      // Update portfolio balance/value
      const updatedPortfolio = await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          totalBalance: portfolio.totalBalance + totalUsd,
          totalValue: portfolio.totalValue - totalUsd,
        },
      });

      // Record trade
      const trade = await tx.trade.create({
        data: {
          userId,
          symbol,
          type: "SELL",
          amount,
          priceUsd,
          totalUsd,
        },
      });

      return { portfolio: updatedPortfolio, holding, trade };
    });

    return NextResponse.json({
      message: "Sell successful",
      data: {
        quantity,
        price: result.trade.priceUsd,
        total: result.trade.totalUsd,
      },
    });
  } catch (err: unknown) {
    console.error("Sell error caught:", err);

    let message = "Internal server error";
    let status = 500;

    if (err instanceof Error) {
      message = err.message;
      if (
        err.message === "Insufficient coin quantity" ||
        err.message === "No holdings for this coin"
      ) {
        status = 400;
      }
    }

    return NextResponse.json({ error: message }, { status });
  }
}
