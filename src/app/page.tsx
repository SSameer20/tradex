"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { features, fetchCoinPrices } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FetchTopGainersCoins,
  FetchTopLosersCoins,
} from "@/components/HeroCard";

export default function Home() {
  const { data: session } = useSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchCoinPrices,
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error loading prices</p>;

  return (
    <main className="relative min-h-svh w-full bg-background flex flex-col items-center transition-colors">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      {!session ? (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-5 py-20">
          <motion.div
            className="mx-auto text-center px-6 flex flex-col items-center z-30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="lg:text-6xl xs:text-4xl font-bold leading-tight tracking-tight xs:max-w-[95svw] lg:max-w-3xl text-white drop-shadow-lg">
              <span className="px-3 py-1 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-glow">
                Next Generation
              </span>{" "}
              Asset Management in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Web3
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 xs:max-w-[95svw] lg:max-w-2xl drop-shadow-md">
              Simplify crypto investments, track portfolios, and grow with
              confidence in a decentralized world.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-glow"
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-300 hover:bg-blue-900/30 hover:text-white"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.section
            initial={{ opacity: 0, transform: "scale(0.95)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="py-24 px-6  w-full"
          >
            <div className="w-full mx-auto text-center">
              <div className="relative grid lg:grid-cols-2 gap-8">
                <div className="absolute bg-[rgba(147,51,234,0.1)] p-6 rounded-lg shadow-[0_0_200px_200px_rgba(147,51,234,0.1)] blur-sm -top-100 left-0 -z-10" />
                <div className="absolute bg-[rgba(157,118,67,0.1)] p-6 rounded-lg shadow-[0_0_200px_150px_rgba(157,118,67,0.1)] blur-sm -top-50 left-50 -z-10" />

                <FetchTopGainersCoins />
                <div className="absolute bg-[rgba(147,51,234,0.2)] p-6 rounded-lg shadow-[0_0_200px_200px_rgba(147,51,234,0.1)] blur-sm right-0 top-30 -z-10" />
                <FetchTopLosersCoins />
              </div>
            </div>
          </motion.section>
        </section>
      ) : (
        <section className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Welcome back, {session.user?.name}!</p>
        </section>
      )}

      {/* Market Overview Section */}

      {/* Features Section */}
      <section className="py-24 xs:py-30 px-6 w-full flex flex-col items-center bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            We make crypto investing effortless, secure, and built for the next
            generation of Web3 users.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-muted shadow-lg"
              >
                <h3 className="font-semibold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6  text-white text-center w-full relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to take control of your crypto journey?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of investors simplifying their portfolios with us.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Start Now
          </Button>
        </div>
        <div
          className="absolute -bottom-50 left-0 w-full h-full 
             bg-gradient-to-b from-purple-600/20 to-blue-600/20 
             pointer-events-none rounded-[30%] 
             blur-3xl scale-110"
        />
      </section>
      <footer>
        <div className="py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tradex. All rights reserved.
        </div>
      </footer>

      {/* Floating Theme Toggle */}
    </main>
  );
}
