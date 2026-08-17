import Link from "next/link";
import { getSessionCustomerId } from "@/lib/loyalty/session";
import { db } from "@/lib/db";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { SandwichIcon, GiftIcon, StarIcon, WaveIcon } from "@/components/icons/AnimatedIcons";

export default async function RewardsLanding() {
  const customerId = await getSessionCustomerId();
  const returning = customerId ? await db.customer.findUnique({ where: { id: customerId } }) : null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brod-background px-6 py-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center">
          <Logo variant="orange" height={32} />
        </div>

        <h1 className="mt-6 flex items-center justify-center gap-2 text-2xl font-bold text-brod-secondary">
          Welcome to Brod <WaveIcon size={24} />
        </h1>
        <p className="mt-2 text-brod-muted">Eat. Visit. Get Rewarded.</p>

        <div className="mt-8 rounded-3xl bg-brod-secondary p-6 text-brod-background shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brod-primary">Brod Rewards</div>
          <div className="mt-4 flex justify-center gap-4 text-brod-primary">
            <SandwichIcon />
            <GiftIcon />
            <StarIcon size={26} />
          </div>
          <p className="mt-4 text-sm text-brod-background/70">Collect a stamp every visit. Unlock a free reward.</p>
        </div>

        <div className="mt-8 space-y-3">
          {returning ? (
            <Link href="/rewards/card">
              <Button>Continue as {returning.name.split(" ")[0]}</Button>
            </Link>
          ) : (
            <>
              <Link href="/rewards/onboarding">
                <Button>Get Started</Button>
              </Link>
              <p className="text-sm text-brod-muted">Already a Brod member?</p>
              <Link href="/rewards/continue">
                <Button variant="secondary">Continue</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
