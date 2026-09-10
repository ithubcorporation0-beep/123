import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

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

    const enrollment = await db.enrollment.findUnique({
      where: { id },
      include: {
        profile: { select: { email: true } },
        course: { select: { title: true } },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    await db.enrollment.delete({
      where: { id },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "enrollment",
      targetId: id,
      details: `Cancelled enrollment for ${enrollment.profile.email} in "${enrollment.course.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_ENROLLMENT_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
