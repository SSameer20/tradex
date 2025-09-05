"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <h2>Sign in to Tradex</h2>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          background: "#4285F4",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
