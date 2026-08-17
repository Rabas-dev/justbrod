import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-brod-background">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
