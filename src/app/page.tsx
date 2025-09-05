"use client";
import Navigation from "@/components/Navigation";
import { fetchCoinPrices } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchCoinPrices,
    refetchInterval: 30000, // refresh every 30s
  });
  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error loading prices</p>;
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center transition-colors">
      <Navigation />
      <section className="mt-32 bg-white dark:bg-[#23272f] px-8 py-10 rounded-xl shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Crypto Portfolio Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Track your crypto assets and performance in one place.
        </p>
        <h1 className="text-2xl font-bold mb-4">Live Crypto Prices</h1>
        <ul className="divide-y divide-gray-200">
          {Object.entries(data).map(([symbol, val]: any) => (
            <li key={symbol} className="flex justify-between py-2">
              <span>{symbol}</span>
              <span>${val.price.toFixed(2)}</span>
              <span
                className={
                  val.change_24h > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {val.change_24h.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
