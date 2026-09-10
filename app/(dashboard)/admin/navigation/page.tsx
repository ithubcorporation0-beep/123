import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NavigationManagerView, NavigationRecord } from "@/components/admin/navigation/NavigationManagerView";
import { Badge } from "@/components/ui/badge";
import { Compass } from "lucide-react";

export default async function AdminNavigationPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const items = await db.navigationItem.findMany({
    orderBy: { position: "asc" },
  });

  const formatted: NavigationRecord[] = items.map((i) => ({
    id: i.id,
    label: i.label,
    url: i.url,
    location: i.location,
    position: i.position,
    isActive: i.isActive,
    openInNewTab: i.openInNewTab,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Navigation Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Compass className="h-3.5 w-3.5 mr-1" /> Menus CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Add, rename, reorder, and configure external links or routes for the public website header and footer menus.
        </p>
      </div>

      <NavigationManagerView initialItems={formatted} />
    </div>
  );
}
