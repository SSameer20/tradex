"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Holding = {
  currentPrice: number;
  currentValue: number;
  symbol: string;
  id: string;
  amount: number;
  portfolioId: string;
  valueUsd: number;
};

type Portfolio = {
  total: number;
  value: number;
  holdings: Holding[];
};

async function fetchPortfolio(): Promise<Portfolio> {
  const res = await fetch("/api/portfolio");
  if (!res.ok) throw new Error("Failed to load portfolio");
  return res.json();
}

export default function PortfolioPage() {
  const { data, isLoading, error } = useQuery<Portfolio>({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    staleTime: 30_000,
  });

  if (isLoading) return <p>Loading portfolio...</p>;
  if (error) return <p>Error loading portfolio</p>;
  if (!data) return <p>No portfolio found</p>;
  console.log(data);

  return (
    <div className="w-full mx-auto p-6 flex flex-col gap-6">
      {/* Summary */}
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <Card className="p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Balance</p>
            <p className="text-2xl font-semibold">${data.total?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Value</p>
            <p className="text-2xl font-semibold">${data.value?.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      {/* Holdings */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Holdings</h2>
        {data.holdings.length === 0 ? (
          <p>No holdings yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Value (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.holdings.map((h) => (
                <TableRow key={h.symbol}>
                  <TableCell>{h.symbol}</TableCell>
                  <TableCell>{h.amount?.toFixed(2)}</TableCell>
                  <TableCell>${h.valueUsd?.toFixed(2)}</TableCell>
                  <TableCell>${(h.amount * h.valueUsd).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
