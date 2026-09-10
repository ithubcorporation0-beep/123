import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId, moduleId } = await params;
    const body = await req.json();
    const { title, description } = body;

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description;

    const updatedModule = await db.courseModule.update({
      where: { id: moduleId, courseId },
      data,
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "module",
      targetId: moduleId,
      details: `Updated module "${updatedModule.title}" in course ${courseId}`,
    });

    return NextResponse.json(updatedModule);
  } catch (error: any) {
    console.error("[ADMIN_MODULE_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId, moduleId } = await params;

    const existing = await db.courseModule.findUnique({
      where: { id: moduleId, courseId },
      select: { title: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    await db.courseModule.delete({
      where: { id: moduleId, courseId },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "module",
      targetId: moduleId,
      details: `Deleted module "${existing.title}" and all its lessons`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_MODULE_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
