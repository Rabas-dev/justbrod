"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function CustomerQr({ token }: { token: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, token, {
      width: 200,
      margin: 1,
      color: { dark: "#2B2118", light: "#00000000" },
    });
  }, [token]);

  return (
    <div className="rounded-2xl border-2 border-dashed border-brod-primary/40 bg-brod-primary/5 p-4 text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brod-muted">Ready for Stamp</div>
      <div className="mt-3 flex justify-center">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>
      <p className="mt-3 text-sm text-brod-muted">Show this screen to your cashier</p>
    </div>
  );
}
