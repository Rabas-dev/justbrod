"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/shared/Button";

export default function AdminRedeem() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error });
      } else {
        setResult({ ok: true, message: `Redeemed: ${data.rewardName} for ${data.customerName}` });
        setCode("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-brod-secondary">Redeem Reward</h1>
      <p className="mt-1 text-sm text-brod-muted">Enter the customer&apos;s reward code to redeem it.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="BRD-XXXXXX"
          className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 font-mono text-lg uppercase tracking-widest outline-none focus:border-brod-primary"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Confirm Redemption"}
        </Button>
      </form>

      {result && (
        <div
          className={
            "mt-5 rounded-xl px-4 py-3 text-sm " +
            (result.ok ? "bg-brod-success/10 text-brod-success" : "bg-brod-danger/10 text-brod-danger")
          }
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
