import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId } = await params;

    const modules = await db.courseModule.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { position: "asc" },
          include: { resources: true },
        },
      },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(modules);
  } catch (error: any) {
    console.error("[ADMIN_MODULES_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId } = await params;
    const body = await req.json();
    const { title, description } = body;

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
        lessons: true,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "module",
      targetId: moduleItem.id,
      details: `Added module "${moduleItem.title}" to course (${courseId})`,
    });

    return NextResponse.json(moduleItem, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_MODULES_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId } = await params;
    const { list } = await req.json();

    if (!Array.isArray(list)) {
      return NextResponse.json({ error: "Invalid module list" }, { status: 400 });
    }

    for (const item of list) {
      await db.courseModule.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "module",
      targetId: courseId,
      details: `Reordered modules for course ${courseId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_MODULES_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
