"use client";

import { use, useState } from "react";
import { CoinChart } from "@/components/CoinPriceChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchCoinPrice, SYMBOLS } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

type PageProps = {
  params: Promise<{ coinname: string }>;
};

export default function CoinTradePage({ params }: PageProps) {
  const { coinname } = use(params);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [qty, setQty] = useState<number>(0);

  const { data: estPrice, isFetching } = useQuery<{
    data: { usd: number };
  } | null>({
    queryKey: ["coinPrice", coinname],
    queryFn: () => fetchCoinPrice(coinname as keyof typeof SYMBOLS),
    enabled: isTradeOpen, // only run when trade popup is open
    staleTime: 30_000,
  });
  const isDisabled = qty <= 0 || isFetching || !estPrice;
  console.log(estPrice);

  async function handleBuyCoin() {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseURL) throw new Error("no base url configured");
      const res = await fetch(`/api/coin/${coinname}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: coinname.substring(0, 3).toUpperCase(),
          quantity: qty,
        }),
      });
      if (!res.ok) {
        alert("failed to buy");
      }
      const data = await res.json();
      alert(`${data?.message} || transaction completed`);
    } catch (err) {
      console.error("Buy failed:", err);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-6 overflow-y-auto">
      {/* Graph */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
        <CoinChart coinId={coinname as keyof typeof SYMBOLS} />
      </div>

      {/* Coin Details */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold capitalize">{coinname} Price</h1>
        <p className="text-4xl font-semibold text-green-500">
          $111,250 <span className="text-lg text-green-400">(+0.5%)</span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Market Cap</span>
            <span>$2,215,854,151,741</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">24h Volume</span>
            <span>$25,617,573,370</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Circulating Supply</span>
            <span>19,917,796</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Total Supply</span>
            <span>19,917,796</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Max Supply</span>
            <span>21,000,000</span>
          </div>
        </div>

        {/* Buy / Sell Button */}
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setIsTradeOpen(true)}
          >
            Buy / Sell
          </Button>
        </div>
      </div>

      {/* Trade Popup */}
      <Dialog open={isTradeOpen} onOpenChange={setIsTradeOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={coinname}>
          <DialogHeader>
            <DialogTitle>Trade {coinname}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              step="0.00000001" // allow decimals
              min="0"
              placeholder="Quantity"
              className="w-full border rounded-lg p-2 dark:bg-gray-800"
              value={qty ?? ""} // only replace null/undefined, not 0
              onChange={(e) => setQty(Number(e.target.value))}
            />

            <span className="flex gap-2">
              Estimated Price:
              {estPrice?.data?.usd && estPrice?.data?.usd * qty}
            </span>

            <div className="flex gap-2">
              <Button
                className="bg-green-500 hover:bg-green-600 flex-1"
                disabled={isDisabled}
                onClick={handleBuyCoin}
              >
                Buy
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 flex-1"
                disabled={isDisabled}
              >
                Sell
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
