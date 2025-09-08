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
import { SYMBOLS } from "@/lib/helper";

type PageProps = {
  params: Promise<{ coinname: string }>;
};

export default function CoinTradePage({ params }: PageProps) {
  const { coinname } = use(params);
  const [isTradeOpen, setIsTradeOpen] = useState(false);

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade {coinname}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Amount in USD"
              className="w-full border rounded-lg p-2 dark:bg-gray-800"
            />
            <div className="flex gap-2">
              <Button className="bg-green-500 hover:bg-green-600 flex-1">
                Buy
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 flex-1">
                Sell
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
