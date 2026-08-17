"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(data.role === "cashier" ? "/admin/scan" : "/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brod-secondary px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-brod-background p-8 shadow-xl">
        <Logo variant="orange" height={20} />
        <h1 className="mt-4 text-xl font-bold text-brod-secondary">Sign In</h1>
        <p className="mt-1 text-sm text-brod-muted">Admin or cashier — enter your password.</p>

        <input
          required
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 text-brod-text outline-none focus:border-brod-primary"
        />

        {error && <p className="mt-2 text-sm text-brod-danger">{error}</p>}

        <div className="mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
