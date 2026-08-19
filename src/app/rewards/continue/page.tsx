"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { WaveIcon } from "@/components/icons/AnimatedIcons";
import { normalizePakistaniPhone, sanitizePhoneInput } from "@/lib/loyalty/phone";

export default function Continue() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phoneValid = normalizePakistaniPhone(phone) !== null;
  const showPhoneError = (phoneTouched && phone.length > 0 && !phoneValid) || (phone.length === 11 && !phoneValid);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phoneValid) {
      setPhoneTouched(true);
      return;
    }

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
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              onBlur={() => setPhoneTouched(true)}
              placeholder="03XXXXXXXXX"
              aria-invalid={showPhoneError}
              className={`w-full rounded-xl border bg-brod-surface px-4 py-3 text-brod-text outline-none ${
                showPhoneError ? "border-brod-danger" : "border-brod-border focus:border-brod-primary"
              }`}
            />
            {showPhoneError && (
              <p className="mt-1.5 text-xs text-brod-danger">Enter a valid number.</p>
            )}
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
