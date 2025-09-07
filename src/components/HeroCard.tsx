import {
  coin_images,
  fetchTopGainers,
  fetchTopLosers,
  symbol_images,
} from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

export function FetchTopGainersCoins() {
  const { data, error, isLoading } = useQuery<
    {
      key: string;
      usd: number;
      usd_24h_change: number;
    }[]
  >({
    queryKey: ["TopGainers"],
    queryFn: fetchTopGainers,
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error loading prices</p>;
  //   return <div>{JSON.stringify(data)}</div>;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <div className="py-2">Top 3 in terms of 24h % Change</div>

      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          <div className="col-span-4">Crypto</div>
          <div className="col-span-3 text-center">24h %</div>
          <div className="col-span-4 text-right">Current Price</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {data?.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
          >
            {/* Coin Name */}
            <div className="col-span-4 flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10  rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  <Image
                    src={coin_images(item.key)}
                    alt={item.key || "crypto"}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.key}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.key?.toUpperCase().substring(0, 3)}
                  </div>
                </div>
              </div>
            </div>

            {/* 24h Change */}
            <div className="col-span-3 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {item.usd_24h_change < 0 ? (
                  // 🔻 negative → red
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                      {item.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  // 🔼 zero or positive → green
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      {item.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Price */}
            <div className="col-span-4 flex items-center justify-center">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  ${item.usd}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  USD
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FetchTopLosersCoins() {
  const { data, error, isLoading } = useQuery<
    {
      key: string;
      usd: number;
      usd_24h_change: number;
    }[]
  >({
    queryKey: ["TopLosers"],
    queryFn: fetchTopLosers,
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error loading prices</p>;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <div className="py-2">Last 3 in terms of 24h % Change</div>
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          <div className="col-span-4">Crypto</div>
          <div className="col-span-3 text-center">24h %</div>
          <div className="col-span-4 text-right">Current Price</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {data?.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
          >
            {/* Coin Name */}
            <div className="col-span-4 flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10  rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  <Image
                    src={coin_images(item.key)}
                    alt={item.key || "crypto"}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.key}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.key?.toUpperCase().substring(0, 3)}
                  </div>
                </div>
              </div>
            </div>

            {/* 24h Change */}
            <div className="col-span-3 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {item.usd_24h_change < 0 ? (
                  // 🔻 negative → red
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                      {item.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  // 🔼 zero or positive → green
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      {item.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Price */}
            <div className="col-span-4 flex items-center justify-center">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  ${item.usd}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  USD
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
