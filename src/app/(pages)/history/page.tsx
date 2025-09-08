"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardAction } from "@/components/ui/card";
interface Trade {
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  type: "BUY" | "SELL";
  date: string;
}

async function fetchTrades(): Promise<Trade[]> {
  const res = await fetch("/api/portfolio/history");
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
}

export default function TransactionHistory() {
  const { data, isLoading, error } = useQuery<Trade[]>({
    queryKey: ["Last10Transactions"],
    queryFn: fetchTrades,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex justify-center items-center text-red-500">
        Failed to load transactions
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center text-muted-foreground">
        No Data Available
      </div>
    );
  }

  return (
    <Card className="p-6 shadow-lg w-full mx-10 my-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Value (USD)</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((h) => (
            <TableRow key={h.date + h.symbol}>
              <TableCell>{h.symbol}</TableCell>
              <TableCell>{h.type}</TableCell>
              <TableCell>${h.quantity?.toFixed(2)}</TableCell>
              <TableCell>${h.price.toFixed(2)}</TableCell>
              <TableCell>${h.value.toFixed(2)}</TableCell>

              <TableCell>
                $
                {new Date(h.date).toLocaleString("en-US", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
