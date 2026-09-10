import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const where: any = {};
    if (section && section !== "all") {
      where.section = section;
    }

    const items = await db.websiteContent.findMany({
      where,
      orderBy: [{ section: "asc" }, { position: "asc" }],
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("[ADMIN_CONTENT_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      section,
      key,
      title,
      subtitle,
      content,
      imageUrl,
      videoUrl,
      linkUrl,
      linkText,
      isPublished = true,
      position = 0,
    } = body;

    if (!section || !key) {
      return NextResponse.json({ error: "Section and unique Key are required" }, { status: 400 });
    }

    const item = await db.websiteContent.upsert({
      where: { key },
      update: {
        section,
        title,
        subtitle,
        content,
        imageUrl,
        videoUrl,
        linkUrl,
        linkText,
        isPublished: Boolean(isPublished),
        position: parseInt(position) || 0,
      },
      create: {
        section,
        key,
        title,
        subtitle,
        content,
        imageUrl,
        videoUrl,
        linkUrl,
        linkText,
        isPublished: Boolean(isPublished),
        position: parseInt(position) || 0,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "content",
      targetId: item.id,
      details: `Saved website CMS block: [${section}] "${title || key}"`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_CONTENT_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
