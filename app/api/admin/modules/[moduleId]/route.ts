import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { moduleId } = await params;
    const body = await req.json();
    const { title, description } = body;

    const existing = await db.courseModule.findUnique({ where: { id: moduleId } });
    if (!existing) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const updated = await db.courseModule.update({
      where: { id: moduleId },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? description : existing.description,
      },
      include: {
        course: { select: { title: true } },
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "module",
      targetId: moduleId,
      details: `Updated module "${updated.title}" in course "${updated.course?.title}"`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_MODULE_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { moduleId } = await params;
    const existing = await db.courseModule.findUnique({
      where: { id: moduleId },
      include: { course: { select: { title: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    await db.courseModule.delete({
      where: { id: moduleId },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "module",
      targetId: moduleId,
      details: `Deleted module "${existing.title}" from course "${existing.course?.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_MODULE_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
