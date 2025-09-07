"use client";

import CoinList from "@/components/CoinList";
import { fetchCoinPrices } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";
import Spinners from "@/components/Spinners";

export default function DashboardPage() {
  const { data, error, isLoading } = useQuery<{
    [key: string]: {
      name: string;
      usd: number;
      usd_24h_change: number;
    };
  }>({
    queryKey: ["prices"],
    queryFn: fetchCoinPrices,
    refetchInterval: 30000,
  });

  if (error) return <div className="text-error">Error loading data</div>;
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinners />
      </div>
    );

  // --- Mock portfolio values (replace with real calculations later) ---
  const totalBalance = 5234.75; // USD left in wallet
  const portfolioValue = 15234.12; // USD total holdings
  const portfolioChange24h = 2.45; // %

  return (
    <div className="w-full min-h-svh px-2 sm:px-5 py-5 flex flex-col items-center bg-background transition-colors">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-card-foreground">
        Trading Dashboard
      </h1>

      {/* Portfolio Summary Section */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Balance */}
        <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <span className="text-2xl font-bold text-card-foreground">
            ${totalBalance.toLocaleString()}
          </span>
        </div>

        {/* Portfolio Value */}
        <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Portfolio Value</span>
          <span className="text-2xl font-bold text-card-foreground">
            ${portfolioValue.toLocaleString()}
          </span>
        </div>

        {/* 24h Change */}
        <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">24h Change</span>
          <div className="flex items-center gap-2">
            {portfolioChange24h >= 0 ? (
              <TrendingUp className="text-green-500 w-5 h-5" />
            ) : (
              <TrendingDown className="text-red-500 w-5 h-5" />
            )}
            <span
              className={`text-2xl font-bold ${
                portfolioChange24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {portfolioChange24h}%
            </span>
          </div>
        </div>
      </div>

      {/* Coin List */}
      <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg p-4">
        <CoinList data={data!} />
      </div>
    </div>
  );
}
