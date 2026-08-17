"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoyaltyCard } from "@/components/customer/LoyaltyCard";
import { OutcomeBanner } from "@/components/customer/OutcomeBanner";
import { CustomerQr } from "@/components/customer/CustomerQr";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { WaveIcon, TargetIcon, HeartIcon, StarIcon } from "@/components/icons/AnimatedIcons";
import { fireStampConfetti, fireRewardConfetti } from "@/lib/confetti";
import type { LoyaltyState } from "@/lib/loyalty/types";

const POLL_MS = 4000;

export default function Card() {
  const router = useRouter();
  const [state, setState] = useState<LoyaltyState | null>(null);
  const [loading, setLoading] = useState(true);
  const stampsRef = useRef<number | null>(null);
  const rewardIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch("/api/loyalty/me");
      const data = await res.json();
      if (cancelled) return;
      if (!data.customer) {
        router.replace("/rewards");
        return;
      }

      const stampAdded = stampsRef.current !== null && data.stamps > stampsRef.current;
      const rewardId: string | null = data.activeReward?.id ?? null;
      const newReward = rewardIdRef.current !== undefined && rewardId !== null && rewardId !== rewardIdRef.current;

      if (newReward) {
        fireRewardConfetti();
      } else if (stampAdded) {
        fireStampConfetti();
      }
      if (stampAdded) data.justCheckedIn = true;

      stampsRef.current = data.stamps;
      rewardIdRef.current = rewardId;
      setState(data);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !state) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-brod-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-brod-primary/30" />
      </div>
    );
  }

  const hasReward = !!state.activeReward;

  return (
    <div className="flex min-h-dvh flex-col bg-brod-background px-6 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex items-center justify-between">
          <Logo variant="orange" height={18} />
        </div>

        <h1 className="mt-4 flex items-center gap-2 text-xl font-bold text-brod-secondary">
          Hey {state.customer.name.split(" ")[0]} <WaveIcon size={22} />
        </h1>
        <p className="text-brod-muted">
          {hasReward ? "Your reward is ready!" : "Ready for your next reward?"}
        </p>

        <div className="mt-5">
          <OutcomeBanner state={state} />
        </div>

        <div className="mt-5">
          <LoyaltyCard
            stamps={state.stamps}
            required={state.program.requiredStamps}
            rewardName={state.program.rewardName}
            programName={state.program.name}
          />
        </div>

        {hasReward && state.activeReward ? (
          <Link href="/rewards/reward" className="mt-5 block">
            <Button>View My Reward</Button>
          </Link>
        ) : (
          <>
            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-sm text-brod-muted">
              {Math.max(state.program.requiredStamps - state.stamps, 0)} visit
              {state.program.requiredStamps - state.stamps === 1 ? "" : "s"} to go
              <TargetIcon size={16} className="text-brod-primary" />
            </p>
            <div className="mt-5">
              <CustomerQr token={state.customer.qrToken} />
            </div>
          </>
        )}

        <div className="mt-8 rounded-2xl border border-brod-border bg-brod-surface p-4 text-center">
          <p className="flex items-center justify-center gap-1.5 font-medium text-brod-secondary">
            Enjoying Brod? <HeartIcon size={16} className="text-brod-primary" />
          </p>
          <p className="mt-1 text-sm text-brod-muted">Your feedback means a lot to us.</p>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brod-primary underline underline-offset-4"
          >
            <StarIcon size={14} /> Leave a Google Review
          </a>
        </div>
      </div>
    </div>
  );
}
