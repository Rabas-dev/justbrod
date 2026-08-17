import confetti from "canvas-confetti";

const BRAND_COLORS = ["#ff4610", "#1a1a1a", "#fff6e8"];

export function fireStampConfetti() {
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 35,
    origin: { y: 0.65 },
    colors: BRAND_COLORS,
    scalar: 0.9,
  });
}

export function fireRewardConfetti() {
  const end = Date.now() + 700;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: BRAND_COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: BRAND_COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors: BRAND_COLORS });
}
