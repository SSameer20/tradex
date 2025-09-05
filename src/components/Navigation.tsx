"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 px-6 py-4 flex justify-between items-center shadow-md dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <a
        href="/"
        className="font-bold text-xl text-white no-underline tracking-wide"
      >
        Tradex
      </a>
      <div>
        {status === "loading" ? (
          <span className="text-gray-200 dark:text-gray-400">Loading...</span>
        ) : session ? (
          <div className="relative flex items-center gap-3">
            <button
              className="flex items-center gap-2 focus:outline-none px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-gray-800 transition"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-blue-300 dark:border-gray-600"
                />
              )}
              <span className="font-medium text-white dark:text-gray-200">
                {session.user?.name}
              </span>
              <svg
                className={`w-4 h-4 ml-1 text-white dark:text-gray-200 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              <div className="absolute right-0 top-14 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 w-44 z-10 border border-blue-100 dark:border-gray-700">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-blue-900 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-blue-50 dark:hover:bg-gray-800"
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
            className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-md hover:bg-yellow-300 transition font-semibold dark:bg-yellow-500 dark:text-gray-900 dark:hover:bg-yellow-400"
            onClick={() => signIn("google")}
          >
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}
