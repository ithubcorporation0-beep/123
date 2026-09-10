import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const teacher = await db.profile.findUnique({
      where: { id },
      include: {
        coursesCreated: {
          include: {
            category: true,
            _count: { select: { enrollments: true, modules: true } },
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("[ADMIN_TEACHER_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name?.trim() || null;
    if (body.email !== undefined) dataToUpdate.email = body.email.trim().toLowerCase();
    if (body.bio !== undefined) dataToUpdate.bio = body.bio || null;
    if (body.phone !== undefined) dataToUpdate.phone = body.phone || null;
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl || null;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.role !== undefined) dataToUpdate.role = body.role;

    const updated = await db.profile.update({
      where: { id },
      data: dataToUpdate,
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "user",
      targetId: id,
      details: `Updated teacher: ${updated.name || updated.email}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_TEACHER_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

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

    const teacher = await db.profile.findUnique({
      where: { id },
      select: { email: true, name: true },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Rather than hard-deleting an instructor with existing courses, we deactivate or demote
    await db.profile.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    await logActivity({
      adminEmail: user.email,
      action: "STATUS_CHANGE",
      targetType: "user",
      targetId: id,
      details: `Suspended teacher account: ${teacher.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_TEACHER_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
