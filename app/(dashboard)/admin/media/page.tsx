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

  let mediaItems: any[] = [];
  try {
    mediaItems = await db.mediaItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("[ADMIN_MEDIA_QUERY_WARN]", err);
  }

  const formattedItems: MediaRecord[] = (mediaItems || []).map((m) => ({
    id: m.id,
    name: m.name || "File",
    url: m.url || "",
    publicId: m.publicId || null,
    type: m.type || "image",
    size: m.size || 0,
    mimeType: m.mimeType || null,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
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
