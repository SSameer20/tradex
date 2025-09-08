"use client";

import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { coin_images } from "@/lib/helper";
import Image from "next/image";

export default function CoinList({
  data,
}: {
  data: {
    [key: string]: {
      name: string;
      usd: number;
      usd_24h_change: number;
    };
  };
}) {
  return (
    <table className="w-full text-sm sm:text-base">
      <thead>
        <tr className="bg-[var(--border)] text-[var(--foreground)]">
          <th className="py-2 px-2 rounded-tl-lg">Coin</th>
          <th className="py-2 px-2">Price (USD)</th>
          <th className="py-2 px-2">24h Change</th>
          <th className="py-2 px-2 rounded-tr-lg">Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, coin]) => (
          <tr
            key={key}
            className="border-b border-[var(--border)] hover:bg-[var(--background)] transition"
          >
            <td className="py-2 px-2 flex items-center gap-2 font-semibold">
              <Image
                src={coin_images(key)}
                alt={coin.name || "crypto"}
                width={40}
                height={40}
              />
              <span>{coin.name}</span>
            </td>
            <td className="py-2 px-2 text-[var(--foreground)] font-mono">
              $
              {coin.usd.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </td>
            <td className="py-2 px-2">
              {coin.usd_24h_change < 0 ? (
                <span className="flex items-center gap-1 text-[var(--error)] font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  {coin.usd_24h_change.toFixed(2)}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[var(--success)] font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {coin.usd_24h_change.toFixed(2)}%
                </span>
              )}
            </td>
            <td className="py-2 px-2">
              <Link
                href={`coin/${key}`}
                className="bg-primary text-background px-3 py-1 rounded-lg font-medium hover:bg-opacity-80 transition"
              >
                Trade
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
