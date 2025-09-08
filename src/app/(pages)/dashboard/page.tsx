"use client";

import CoinList from "@/components/CoinList";
import { fetchCoinPrices, fetchUserPortfolioDetails } from "@/lib/helper";
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

  const {
    data: portfolioData,
    isLoading: isPortfolioLoading,
    error: portfolioError,
  } = useQuery<{
    total: number;
    value: number;
    holdings: {
      currentPrice: number;
      currentValue: number;
      symbol: string;
      id: string;
      amount: number;
      portfolioId: string;
      valueUsd: number;
    }[];
    "24h_change": number;
  }>({
    queryKey: ["portfolio"],
    queryFn: fetchUserPortfolioDetails,
  });

  if (error || portfolioError)
    return <div className="text-error">Error loading data</div>;
  if (isLoading || isPortfolioLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinners />
      </div>
    );

  return (
    <div className="w-full min-h-svh px-2 sm:px-5 py-5 flex flex-col items-center bg-background transition-colors xs:overflow-y-auto">
      {/* Portfolio Summary Section */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Balance */}
        <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <span className="text-2xl font-bold text-card-foreground">
            ${portfolioData?.total.toLocaleString()}
          </span>
        </div>
        {/* Portfolio Value */}
        <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Portfolio Value</span>
          <span className="text-2xl font-bold text-card-foreground">
            ${portfolioData?.value.toLocaleString()}
          </span>
        </div>
        {/* 24h Change */}
        {portfolioData && typeof portfolioData["24h_change"] === "number" && (
          <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <div className="flex items-center gap-2">
              {portfolioData["24h_change"] >= 0 ? (
                <TrendingUp className="text-[var(--success)] w-5 h-5" />
              ) : (
                <TrendingDown className="text-[var(--error)] w-5 h-5" />
              )}
              <span
                className={`text-2xl font-bold ${
                  portfolioData["24h_change"] >= 0
                    ? "text-[var(--success)]"
                    : "text-[var(--error)]"
                }`}
              >
                {portfolioData["24h_change"]}%
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Coin List */}
      <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg py-4 px-2">
        <CoinList data={data!} />
      </div>
    </div>
  );
}
