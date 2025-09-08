"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { fetchChartDetailsById, SYMBOLS } from "@/lib/helper";

export const description = "A simple area chart";

// Match the `dataKey` with your chart data shape
const chartConfig = {
  price: {
    label: "Price (USD)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function CoinChart({ coinId }: { coinId: string }) {
  console.log("Rendering CoinChart for:", coinId);
  const { data, isLoading, error } = useQuery({
    queryKey: ["coinChart", coinId],
    queryFn: () => fetchChartDetailsById(coinId),
    refetchInterval: 15 * 1000,
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg">
        Error loading chart data
      </div>
    );

  if (!data)
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg">
        No data found
      </div>
    );
  console.log(data);

  // format CoinGecko array -> recharts object array
  const chartData = data.prices.map(([timestamp, price]: [number, number]) => ({
    time: new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price,
  }));

  if (data && data.change24h)
    return (
      <Card className="w-full h-full bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {coinId.toUpperCase()} {data.change24h.toFixed(2)}%{" "}
            {data && data.change24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
          <CardDescription>Last 24h</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                hide // 👈 hides the X axis labels
              />
              <YAxis
                dataKey="price"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                hide // 👈 hides the Y axis labels
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="price"
                type="monotone"
                fill="var(--color-price)"
                fillOpacity={0.4}
                stroke="var(--color-price)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {data && data.change24h >= 0 ? (
                <div className="flex items-center gap-2 leading-none font-medium">
                  Trending up by {data.change24h.toFixed(2)}% today{" "}
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="flex items-center gap-2 leading-none font-medium">
                  Trending down by {data.change24h.toFixed(2)}% today{" "}
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    );
}
