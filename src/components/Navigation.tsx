"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full  text-[var(--foreground)] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-md h-1/10">
      <a
        href="/"
        className="font-bold text-lg sm:text-xl text-card-foreground no-underline tracking-wide"
      >
        TradeX
      </a>
      <div>
        {status === "loading" ? (
          <span className="text-card-foreground opacity-70">Loading...</span>
        ) : session ? (
          <div className="relative flex items-center gap-2 sm:gap-3 cursor-pointer">
            <button
              className="flex items-center gap-2 focus:outline-none px-2 py-1 rounded hover:bg-border transition cursor-pointer"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {session.user?.image && (
                <Avatar>
                  <AvatarImage src={session.user.image} alt="profile" />
                  <AvatarFallback>
                    {session.user?.name || "user"}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="font-medium text-card-foreground truncate max-w-[100px] sm:max-w-[150px]">
                {session.user?.name}
              </span>
              <svg
                className={`w-4 h-4 ml-1 text-card-foreground transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 sm:top-14 bg-card rounded-lg shadow-lg py-2 w-40 sm:w-44 z-10 border border-border">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-card-foreground hover:bg-background transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  className="block w-full text-left px-4 py-2 text-error hover:bg-background transition"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-warning text-card-foreground px-4 sm:px-5 py-2 rounded-md hover:bg-opacity-80 transition font-semibold cursor-pointer"
            onClick={() => signIn("google")}
          >
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}
