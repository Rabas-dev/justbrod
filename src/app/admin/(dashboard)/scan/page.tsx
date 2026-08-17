"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/shared/Button";
import { CheckIcon } from "@/components/icons/AnimatedIcons";
import type { LoyaltyState } from "@/lib/loyalty/types";
import type QrScannerType from "qr-scanner";

type View = "scanning" | "found" | "stamped" | "error";

export default function AdminScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScannerType | null>(null);

  const [view, setView] = useState<View>("scanning");
  const [state, setState] = useState<LoyaltyState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stamping, setStamping] = useState(false);
  const [manualPhone, setManualPhone] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("qr-scanner").then(({ default: QrScanner }) => {
      if (cancelled || !videoRef.current) return;
      QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";
      const scanner = new QrScanner(
        videoRef.current,
        (result) => handleToken(result.data),
        { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 5 }
      );
      scannerRef.current = scanner;
      scanner
        .start()
        .then(() => !cancelled && setCameraReady(true))
        .catch(() => !cancelled && setCameraReady(false));
    });

    return () => {
      cancelled = true;
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pauseScanner() {
    scannerRef.current?.stop();
  }

  function resumeScanner() {
    scannerRef.current?.start().catch(() => {});
  }

  async function handleToken(qrToken: string) {
    pauseScanner();
    await lookup({ qrToken });
  }

  async function lookup(body: { qrToken?: string; phone?: string }) {
    setError(null);
    try {
      const res = await fetch("/api/admin/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Customer not found.");
        setView("error");
        return;
      }
      setState(data);
      setView("found");
    } catch {
      setError("Something went wrong. Please try again.");
      setView("error");
    }
  }

  async function submitManual(e: FormEvent) {
    e.preventDefault();
    pauseScanner();
    await lookup({ phone: manualPhone });
  }

  async function addStamp() {
    if (!state) return;
    setStamping(true);
    try {
      const res = await fetch("/api/admin/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: state.customer.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setView("error");
        return;
      }
      setState(data);
      setView("stamped");
      setTimeout(reset, 2500);
    } finally {
      setStamping(false);
    }
  }

  async function undo() {
    if (!state) return;
    const res = await fetch("/api/admin/stamp/undo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: state.customer.id }),
    });
    const data = await res.json();
    if (res.ok) setState(data);
    reset();
  }

  function reset() {
    setState(null);
    setError(null);
    setManualPhone("");
    setView("scanning");
    resumeScanner();
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-brod-secondary">Scan Customer</h1>
      <p className="mt-1 text-sm text-brod-muted">Verify the purchase, then scan the customer&apos;s QR to add a stamp.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brod-border bg-brod-secondary">
        <video ref={videoRef} className={view === "scanning" ? "aspect-square w-full object-cover" : "hidden"} />
        {view === "scanning" && !cameraReady && (
          <p className="p-6 text-center text-sm text-brod-background/70">Waiting for camera access…</p>
        )}
      </div>

      {view === "scanning" && (
        <form onSubmit={submitManual} className="mt-5 space-y-3">
          <p className="text-center text-xs uppercase tracking-wide text-brod-muted">or enter mobile number</p>
          <input
            required
            inputMode="tel"
            value={manualPhone}
            onChange={(e) => setManualPhone(e.target.value)}
            placeholder="03XX XXXXXXX"
            className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 outline-none focus:border-brod-primary"
          />
          <Button type="submit" variant="secondary">Look Up Customer</Button>
        </form>
      )}

      {view === "error" && (
        <div className="mt-6 rounded-2xl border border-brod-border bg-brod-surface p-6 text-center">
          <p className="text-brod-danger">{error}</p>
          <div className="mt-4">
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      )}

      {view === "found" && state && (
        <div className="mt-6 rounded-2xl border border-brod-border bg-brod-surface p-6 text-center">
          <div className="text-lg font-bold text-brod-secondary">{state.customer.name}</div>
          <div className="mt-1 text-sm text-brod-muted">{state.customer.phone}</div>

          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: state.program.requiredStamps }, (_, i) => (
              <span key={i} className={i < state.stamps ? "text-brod-primary" : "text-brod-muted/30"}>●</span>
            ))}
          </div>
          <div className="mt-2 text-sm text-brod-muted">
            {state.stamps} / {state.program.requiredStamps} stamps
          </div>

          {state.activeReward && (
            <p className="mt-3 rounded-lg bg-brod-success/10 px-3 py-2 text-sm text-brod-success">
              Has an unredeemed reward — use Redeem instead.
            </p>
          )}

          <div className="mt-5 space-y-2">
            <Button onClick={addStamp} disabled={stamping}>
              {stamping ? "Adding…" : "Eligible — Add Stamp"}
            </Button>
            <Button variant="secondary" onClick={reset}>Cancel</Button>
          </div>
        </div>
      )}

      {view === "stamped" && state && (
        <div className="mt-6 rounded-2xl border border-brod-border bg-brod-surface p-6 text-center">
          <div className="flex justify-center text-brod-success">
            <CheckIcon size={30} />
          </div>
          <div className="mt-1 text-lg font-bold text-brod-secondary">Stamp Added!</div>
          <div className="mt-1 text-brod-text">{state.customer.name}</div>
          <div className="mt-3 text-2xl font-bold text-brod-primary">
            {state.stamps} / {state.program.requiredStamps}
          </div>
          <button onClick={undo} className="mt-4 text-sm text-brod-muted underline underline-offset-4">
            Undo last stamp
          </button>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-brod-border bg-brod-surface p-4 text-center text-sm text-brod-muted">
        Only add a stamp after confirming a qualifying purchase at checkout.
      </div>
    </div>
  );
}
