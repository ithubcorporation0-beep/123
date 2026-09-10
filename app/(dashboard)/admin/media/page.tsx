import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MediaLibraryManager, MediaRecord } from "@/components/admin/media/MediaLibraryManager";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const mediaItems = await db.mediaItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedItems: MediaRecord[] = mediaItems.map((m) => ({
    id: m.id,
    name: m.name,
    url: m.url,
    publicId: m.publicId,
    type: m.type,
    size: m.size,
    mimeType: m.mimeType,
    createdAt: m.createdAt,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Central Media Library
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <ImageIcon className="h-3 w-3 mr-1" /> Assets CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Store, preview, copy URLs, and manage all course images, lecture videos, PDFs, and website graphics.
        </p>
      </div>

      <MediaLibraryManager initialItems={formattedItems} />
    </div>
  );
}
