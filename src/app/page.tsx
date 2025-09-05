import Navigation from "@/components/Navigation";

export default function Home() {
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
      </section>
    </main>
  );
}
