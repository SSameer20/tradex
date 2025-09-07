"use client";
import Navigation from "@/components/Navigation";
import { ModeToggle } from "@/components/ThemeToggle";
import { fetchCoinPrices } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchCoinPrices,
    refetchInterval: 30000, // refresh every 30s
  });
  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error loading prices</p>;
  return (
    <main className="h-screen w-screen bg-[var(--background)] flex flex-col items-center transition-colors">
      <Navigation />
      <section className="bg-red-200 h-full w-full">
        <ModeToggle className="absolute bottom-4 right-4" />
      </section>
    </main>
  );
}
