"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { WaveIcon } from "@/components/icons/AnimatedIcons";
import { normalizePakistaniPhone, sanitizePhoneInput } from "@/lib/loyalty/phone";

export default function Onboarding() {
  const router = useRouter();

  const [name, setName] = useState("");
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
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
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
          Welcome to Brod <WaveIcon size={22} />
        </h1>
        <p className="mt-2 text-brod-muted">Let&apos;s create your rewards card.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmed Khan"
              className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 text-brod-text outline-none focus:border-brod-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Mobile number</label>
            <input
              required
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
            {loading ? "Please wait…" : "Start My Rewards"}
          </Button>

          <p className="text-center text-xs text-brod-muted">By continuing, you agree to Brod&apos;s terms.</p>
        </form>
      </div>
    </div>
  );
}
