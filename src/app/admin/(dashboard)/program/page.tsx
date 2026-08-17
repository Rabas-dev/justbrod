"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/shared/Button";

type Program = { requiredStamps: number; rewardName: string; rewardValidDays: number };

export default function AdminProgram() {
  const [program, setProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/program/current")
      .then((r) => r.json())
      .then(setProgram);
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!program) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!program) return null;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-brod-secondary">Loyalty Program</h1>

      <form onSubmit={save} className="mt-6 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Required check-ins</label>
          <input
            type="number"
            min={1}
            max={50}
            value={program.requiredStamps}
            onChange={(e) => setProgram({ ...program, requiredStamps: Number(e.target.value) })}
            className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 outline-none focus:border-brod-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Reward name</label>
          <input
            value={program.rewardName}
            onChange={(e) => setProgram({ ...program, rewardName: e.target.value })}
            className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 outline-none focus:border-brod-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brod-secondary">Reward validity (days)</label>
          <input
            type="number"
            min={1}
            max={365}
            value={program.rewardValidDays}
            onChange={(e) => setProgram({ ...program, rewardValidDays: Number(e.target.value) })}
            className="w-full rounded-xl border border-brod-border bg-brod-surface px-4 py-3 outline-none focus:border-brod-primary"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>

        {saved && <p className="text-sm text-brod-success">Saved.</p>}
      </form>
    </div>
  );
}
