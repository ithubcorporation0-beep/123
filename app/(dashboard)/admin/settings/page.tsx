import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSettingsView } from "@/components/admin/settings/AdminSettingsView";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const settings = await db.adminSetting.findMany();
  const config: Record<string, string> = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Admin System Settings
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Settings className="h-3.5 w-3.5 mr-1" /> Global Config
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure LMS platform identity, logo assets, campus contacts, social channels, and search engine metadata.
        </p>
      </div>

      <AdminSettingsView initialSettings={config} />
    </div>
  );
}
