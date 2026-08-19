"use client";

import { useState } from "react";

export type CustomerExportRow = {
  name: string;
  phone: string;
  joinedAt: string;
  lastActivityAt: string | null;
  stamps: number;
  requiredStamps: number;
  rewardStatus: string | null;
};

export function CustomersExportButton({
  rows,
  rangeLabel,
}: {
  rows: CustomerExportRow[];
  rangeLabel: string;
}) {
  const [exporting, setExporting] = useState(false);

  async function exportPdf() {
    setExporting(true);
    try {
      const [{ default: jsPDF }, autoTable] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable").then((m) => m.default),
      ]);

      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(14);
      doc.text("Brod Rewards — Customers", 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`${rangeLabel} · Generated ${new Date().toLocaleString()} · ${rows.length} customer(s)`, 14, 22);

      autoTable(doc, {
        startY: 28,
        head: [["Customer", "Phone", "Joined", "Last Activity", "Stamps", "Reward"]],
        body: rows.map((r) => [
          r.name,
          r.phone,
          r.joinedAt,
          r.lastActivityAt ?? "—",
          `${r.stamps} / ${r.requiredStamps}`,
          r.rewardStatus ?? "—",
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [242, 108, 25] },
      });

      doc.save(`brod-customers-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportPdf}
      disabled={exporting || rows.length === 0}
      className="rounded-xl border border-brod-border bg-white px-4 py-2 text-sm font-medium text-brod-secondary transition hover:bg-brod-surface disabled:opacity-50"
    >
      {exporting ? "Exporting…" : "Export PDF"}
    </button>
  );
}
