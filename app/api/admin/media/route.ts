import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const query = searchParams.get("q") || "";

    const where: any = {};
    if (type && type !== "all") {
      where.type = type;
    }
    if (query) {
      where.name = { contains: query, mode: "insensitive" };
    }

    const mediaItems = await db.mediaItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mediaItems);
  } catch (error: any) {
    console.error("[ADMIN_MEDIA_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch media library" },
      { status: 500 }
    );
  }
}
