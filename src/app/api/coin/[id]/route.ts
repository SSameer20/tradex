import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // <- make sure you have this configured
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  // Fetch coin details using the session information
  try {
    const { id: coinId } = await context.params;

    const coinDetails = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        headers: {
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY as string,
        },
      }
    );
    if (!coinDetails.ok) {
      throw new Error("Failed to fetch coin details");
    }
    const coinSlug = await coinDetails.json();
    console.log(coinSlug);
    return NextResponse.json({ data: coinSlug });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch coin details" });
  }
}
