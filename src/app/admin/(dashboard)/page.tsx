import { db } from "@/lib/db";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminDashboard() {
  const [todaysCheckins, totalCustomers, rewardsUnlocked, rewardsRedeemed, recentCheckins] = await Promise.all([
    db.checkIn.count({ where: { checkinDate: todayKey() } }),
    db.customer.count(),
    db.reward.count(),
    db.reward.count({ where: { status: "REDEEMED" } }),
    db.checkIn.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
  ]);

  const cards = [
    { label: "Today's Check-ins", value: todaysCheckins },
    { label: "Total Customers", value: totalCustomers },
    { label: "Rewards Unlocked", value: rewardsUnlocked },
    { label: "Rewards Redeemed", value: rewardsRedeemed },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brod-secondary">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-brod-border bg-brod-surface p-5">
            <div className="text-2xl font-bold text-brod-secondary">{c.value}</div>
            <div className="mt-1 text-sm text-brod-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-brod-border bg-brod-surface p-5">
        <h2 className="font-semibold text-brod-secondary">Recent Activity</h2>
        {recentCheckins.length === 0 ? (
          <p className="mt-3 text-sm text-brod-muted">No check-ins yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brod-border">
            {recentCheckins.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-brod-text">{c.customer.name} checked in</span>
                <span className="text-brod-muted">{new Date(c.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
