import { Sidebar } from "@/components/admin/Sidebar";
import { getAdminRole } from "@/lib/admin/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getAdminRole();

  return (
    <div className="flex min-h-dvh flex-col bg-brod-background sm:flex-row">
      <Sidebar role={role ?? "admin"} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
