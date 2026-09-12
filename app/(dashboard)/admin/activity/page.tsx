import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminActivityLogView, LogItem } from "@/components/admin/activity/AdminActivityLogView";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default async function AdminActivityPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let logs: any[] = [];
  try {
    logs = await db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (err) {
    console.warn("[ADMIN_ACTIVITY_QUERY_WARN]", err);
  }

  const formatted: LogItem[] = (logs || []).map((l) => ({
    id: l.id,
    adminEmail: l.adminEmail || "Admin",
    action: l.action || "UPDATE",
    targetType: l.targetType || "SYSTEM",
    targetId: l.targetId || null,
    details: l.details || null,
    createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Admin Activity Logs
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Activity className="h-3.5 w-3.5 mr-1" /> Security Audit
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete chronological audit trail recording every content creation, course modification, lesson deletion, and setting update.
        </p>
      </div>

      <AdminActivityLogView initialLogs={formatted} />
    </div>
  );
}
