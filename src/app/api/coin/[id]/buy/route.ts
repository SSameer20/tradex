import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface BuyRequestBody {
  symbol: string;
  quantity: number;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("POST /buy called"); // Step 0
  const session = await getServerSession(authOptions);
  console.log("Session fetched:", session); // Step 1

  if (!session) {
    console.log("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Step 2: parse request body
    const body: BuyRequestBody = await req.json();
    console.log("Request body:", body);

    const { symbol, quantity } = body;
    const { id: coinId } = await context.params;
    console.log("Coin ID from params:", coinId);

    const userId = session.user.id;
    console.log("User ID:", userId);

    if (!userId || !symbol || !quantity) {
      console.log("Missing fields detected");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Step 3: fetch coin price
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("Base URL:", baseUrl);

    if (!baseUrl) throw new Error("BASE_URL not defined");

    const coinPriceRes = await fetch(`${baseUrl}/api/coin/${coinId}/price`);
    // console.log("Coin price response:", coinPriceRes);

    if (!coinPriceRes.ok) {
      console.log("Failed to fetch coin price, status:", coinPriceRes.status);
      return NextResponse.json(
        { error: "Failed to fetch coin price" },
        { status: 500 }
      );
    }

    const coinData = await coinPriceRes.json();
    console.log("Coin data fetched:", coinData);

    const coinInfo = coinData.data;
    console.log("Coin info extracted:", coinInfo);

    if (!coinInfo || coinInfo.usd === undefined) {
      console.log("Invalid coin data");
      return NextResponse.json({ error: "Invalid coin data" }, { status: 500 });
    }

    const priceUsd = coinInfo.usd;
    console.log("Price USD:", priceUsd);

    const amount = quantity;
    const totalUsd = priceUsd * quantity;
    console.log("Amount:", amount, "Total USD:", totalUsd);

    // Step 4: execute transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("Starting DB transaction");

      let portfolio = await tx.portfolio.findUnique({
        where: { userId },
        include: { holdings: true },
      });
      console.log("Fetched portfolio:", portfolio);

      if (!portfolio) {
        console.log("Creating new portfolio for user");
        portfolio = await tx.portfolio.create({
          data: {
            userId,
            totalBalance: 100000,
            totalValue: 0,
          },
          include: { holdings: true },
        });
      }

      if (portfolio.totalBalance < totalUsd) {
        console.log("Insufficient balance:", portfolio.totalBalance);
        throw new Error("Insufficient balance");
      }

      const updatedBalance = portfolio.totalBalance - totalUsd;

      const existingHolding = portfolio.holdings.find(
        (h) => h.symbol === symbol
      );
      console.log("Existing holding found:", existingHolding);

      let holding;
      if (existingHolding) {
        console.log("Updating existing holding");
        holding = await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            amount: existingHolding.amount + amount,
            valueUsd: existingHolding.valueUsd + totalUsd,
          },
        });
      } else {
        console.log("Creating new holding");
        holding = await tx.holding.create({
          data: {
            portfolioId: portfolio.id,
            symbol,
            amount,
            valueUsd: totalUsd,
          },
        });
      }

      console.log("Updating portfolio balance and total value");
      const updatedPortfolio = await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          totalBalance: updatedBalance,
          totalValue: portfolio.totalValue + totalUsd,
        },
      });

      console.log("Recording trade");
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

    return NextResponse.json({
      message: "Buy successful",
      data: {
        quantity,
        price: result.trade.priceUsd,
        total: result.trade.totalUsd,
      },
    });
  } catch (err: unknown) {
    console.error("Buy error caught:", err);

    let message = "Internal server error";
    let status = 500;

    if (err instanceof Error) {
      message = err.message;
      status = err.message === "Insufficient balance" ? 400 : 500;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
