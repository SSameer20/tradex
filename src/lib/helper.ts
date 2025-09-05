export async function fetchCoinPrices() {
  const res = await fetch("/api/price", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
