"use client";

import { signIn } from "next-auth/react";

type SignInPageProps = {
  callbackUrl?: string;
};

export default function SignInPage({
  callbackUrl = "/dashboard",
}: SignInPageProps) {
  return (
    <div className="w-full min-h-svh flex justify-center items-center bg-background transition-colors">
      <div className="bg-muted lg:w-1/3 xs:w-2/3 flex flex-col items-center p-10 rounded-lg shadow-lg">
        <span className="text-2xl font-bold text-center mb-4 text-card-foreground">
          Welcome to TradeX Family
        </span>
        <button
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Sign in with Google
        </button>
        <button
          className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Register with Google
        </button>
      </div>
    </div>
  );
}
