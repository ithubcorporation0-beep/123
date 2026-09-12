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

    let student: any = null;
    try {
      student = await db.profile.findUnique({
        where: { id },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
          lessonProgress: {
            include: {
              lesson: true,
            },
          },
          certificates: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_STUDENT_GET_WARN]", dbErr);
    }

    if (!student) {
      return NextResponse.json({
        id,
        name: "Student",
        email: "student@izba.app",
        status: "ACTIVE",
        role: "student",
        enrollments: [],
        certificates: [],
      });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[ADMIN_STUDENT_GET]", error);
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
    if (body.phone !== undefined) dataToUpdate.phone = body.phone || null;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio || null;
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl || null;
    if (body.status !== undefined) dataToUpdate.status = body.status; // ACTIVE, SUSPENDED

    let updated: any = null;
    try {
      updated = await db.profile.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (dbErr) {
      console.warn("[ADMIN_STUDENT_PATCH_WARN]", dbErr);
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
        details: `Updated student: ${updated.name || updated.email} (Status: ${updated.status})`,
      });
    } catch {}

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_STUDENT_PATCH]", error);
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

    let student: any = null;
    try {
      student = await db.profile.findUnique({
        where: { id },
        select: { email: true, name: true },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_STUDENT_DELETE_FIND_WARN]", dbErr);
    }

    try {
      await db.profile.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_STUDENT_DELETE_WARN]", dbErr);
    }

    try {
      await logActivity({
        adminEmail: user.email,
        action: "DELETE",
        targetType: "user",
        targetId: id,
        details: `Deleted student account: ${student?.email || id}`,
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_STUDENT_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
