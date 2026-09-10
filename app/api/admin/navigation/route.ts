import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    const where: any = {};
    if (location && location !== "all") {
      where.location = location;
    }

    const items = await db.navigationItem.findMany({
      where,
      orderBy: { position: "asc" },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("[ADMIN_NAVIGATION_GET]", error);
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
    const { label, url, location = "header", openInNewTab = false, isActive = true } = body;

    if (!label || !url) {
      return NextResponse.json({ error: "Label and URL are required" }, { status: 400 });
    }

    const last = await db.navigationItem.findFirst({
      where: { location },
      orderBy: { position: "desc" },
    });

    const position = last ? last.position + 1 : 1;

    const item = await db.navigationItem.create({
      data: {
        label: label.trim(),
        url: url.trim(),
        location,
        position,
        openInNewTab: Boolean(openInNewTab),
        isActive: Boolean(isActive),
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "content",
      targetId: item.id,
      details: `Created navigation link: "${item.label}" -> ${item.url}`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_NAVIGATION_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { list } = await req.json();

    if (!Array.isArray(list)) {
      return NextResponse.json({ error: "Invalid list" }, { status: 400 });
    }

    for (const item of list) {
      await db.navigationItem.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_NAVIGATION_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
