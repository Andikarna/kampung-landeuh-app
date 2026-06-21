import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side admin protection
  try {
    const session = await requireAdmin();
    if (!session) {
      redirect("/masuk");
    }
  } catch (error) {
    redirect("/masuk");
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:pl-64">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
