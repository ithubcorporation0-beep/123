import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full relative min-h-screen bg-muted/20">
      {/* Desktop Sidebar Fixed */}
      <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar userRole={user.role} userName={user.name} />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNavbar
          userRole={user.role}
          userName={user.name}
          userEmail={user.email}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
