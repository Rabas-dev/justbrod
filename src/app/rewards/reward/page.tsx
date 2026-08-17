"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { GiftIcon } from "@/components/icons/AnimatedIcons";
import type { LoyaltyState } from "@/lib/loyalty/types";

export default function Reward() {
  const [state, setState] = useState<LoyaltyState | null>(null);

  useEffect(() => {
    fetch("/api/loyalty/me")
      .then((r) => r.json())
      .then((d) => setState(d.customer ? d : null));
  }, []);

  if (!state) {
    return <div className="flex min-h-dvh items-center justify-center bg-brod-background" />;
  }

  if (!state.activeReward) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-brod-background px-6 text-center">
        <p className="text-brod-muted">No active reward right now — keep collecting stamps!</p>
        <Link href="/rewards/card" className="mt-4">
          <Button>Back to My Card</Button>
        </Link>
      </div>
    );
  }

  const expires = new Date(state.activeReward.expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brod-background px-6 py-10 text-center">
      <div className="w-full max-w-sm rounded-3xl bg-brod-surface p-8 shadow-xl">
        <div className="flex justify-center text-brod-primary">
          <GiftIcon size={44} />
        </div>
        <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-brod-muted">Your Reward</div>
        <div className="mt-1 text-2xl font-bold text-brod-secondary">{state.activeReward.rewardName}</div>
        <p className="mt-3 text-sm text-brod-muted">Show this code to a Brod team member to redeem.</p>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-brod-primary/40 bg-brod-primary/5 py-4">
          <div className="text-xs uppercase tracking-wide text-brod-muted">Reward Code</div>
          <div className="mt-1 text-2xl font-bold tracking-widest text-brod-primary">{state.activeReward.code}</div>
        </div>

        <p className="mt-4 text-xs text-brod-muted">Valid until {expires}</p>
      </div>

      <Link href="/rewards/card" className="mt-6 w-full max-w-sm">
        <Button variant="secondary">Back to My Card</Button>
      </Link>
    </div>
  );
}
