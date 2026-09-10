import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const media = await db.mediaItem.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Try deleting local file if it starts with /uploads/
    if (media.url.startsWith("/uploads/")) {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "public", media.url);
        await fs.unlink(filePath).catch(() => {});
      } catch (err) {
        console.warn("Could not delete local file:", err);
      }
    }

    await db.mediaItem.delete({
      where: { id },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "media",
      targetId: id,
      details: `Deleted media file: ${media.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_MEDIA_DELETE]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete media item" },
      { status: 500 }
    );
  }
}
