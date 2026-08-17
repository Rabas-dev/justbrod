"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { WaveIcon } from "@/components/icons/AnimatedIcons";

export default function Continue() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/loyalty/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/rewards/card");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center bg-brod-background px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-brod-secondary">
          Welcome back <WaveIcon size={22} />
        </h1>
        <p className="mt-2 text-brod-muted">Enter your mobile number to see your Brod Rewards card.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Mobile number</label>
            <input
              required
              autoFocus
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX XXXXXXX"
              className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 text-brod-text outline-none focus:border-brod-primary"
            />
          </div>

          {error && <p className="text-sm text-brod-danger">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Please wait…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
