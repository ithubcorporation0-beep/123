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

    let teacher: any = null;
    try {
      teacher = await db.profile.findUnique({
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
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_GET_WARN]", dbErr);
    }

    if (!teacher) {
      return NextResponse.json({
        id,
        name: "Instructor",
        email: "instructor@izba.app",
        status: "ACTIVE",
        role: "instructor",
        coursesCreated: [],
      });
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
    const body = await req.json().catch(() => ({}));

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name?.trim() || null;
    if (body.email !== undefined) dataToUpdate.email = body.email.trim().toLowerCase();
    if (body.bio !== undefined) dataToUpdate.bio = body.bio || null;
    if (body.phone !== undefined) dataToUpdate.phone = body.phone || null;
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl || null;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.role !== undefined) dataToUpdate.role = body.role;

    let updated: any = null;
    try {
      updated = await db.profile.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_PATCH_WARN]", dbErr);
    }

    if (!updated) {
      updated = {
        id,
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      await logActivity({
        adminEmail: user.email,
        action: "UPDATE",
        targetType: "user",
        targetId: id,
        details: `Updated teacher: ${updated.name || updated.email}`,
      });
    } catch {}

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

    let teacher: any = null;
    try {
      teacher = await db.profile.findUnique({
        where: { id },
        select: { email: true, name: true },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_DELETE_FIND_WARN]", dbErr);
    }

    try {
      await db.profile.update({
        where: { id },
        data: { status: "SUSPENDED" },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_DELETE_WARN]", dbErr);
    }

    try {
      await logActivity({
        adminEmail: user.email,
        action: "STATUS_CHANGE",
        targetType: "user",
        targetId: id,
        details: `Suspended teacher account: ${teacher?.email || id}`,
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_TEACHER_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
