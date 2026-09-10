import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (courseId && courseId !== "all") {
      where.courseId = courseId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const modules = await db.courseModule.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, slug: true, thumbnail: true },
        },
        lessons: {
          orderBy: { position: "asc" },
          include: { resources: true },
        },
      },
      orderBy: [{ course: { title: "asc" } }, { position: "asc" }],
    });

    return NextResponse.json(modules);
  } catch (error: any) {
    console.error("[ADMIN_MODULES_GLOBAL_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, title, description } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Module title is required" }, { status: 400 });
    }

    const lastModule = await db.courseModule.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastModule ? lastModule.position + 1 : 1;

    const moduleItem = await db.courseModule.create({
      data: {
        title: title.trim(),
        description: description || null,
        position: newPosition,
        courseId,
      },
      include: {
        course: { select: { title: true } },
        lessons: true,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "module",
      targetId: moduleItem.id,
      details: `Created module "${moduleItem.title}" in course "${moduleItem.course?.title}"`,
    });

    return NextResponse.json(moduleItem, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_MODULES_GLOBAL_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { items } = body; // Array of { id, position }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    await Promise.all(
      items.map((item) =>
        db.courseModule.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_MODULES_GLOBAL_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
