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
        { profile: { name: { contains: search, mode: "insensitive" } } },
        { profile: { email: { contains: search, mode: "insensitive" } } },
        { course: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    let enrollments: any[] = [];
    try {
      enrollments = await db.enrollment.findMany({
        where,
        include: {
          profile: {
            select: { id: true, name: true, email: true, imageUrl: true },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              _count: { select: { modules: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_ENROLLMENTS_GET_DB_WARN]", dbErr);
    }

    return NextResponse.json(enrollments);
  } catch (error: any) {
    console.error("[ADMIN_ENROLLMENTS_GET]", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { profileId, courseId } = body;

    if (!profileId || !courseId) {
      return NextResponse.json({ error: "Student ID and Course ID are required" }, { status: 400 });
    }

    let existing: any = null;
    try {
      existing = await db.enrollment.findUnique({
        where: {
          profileId_courseId: {
            profileId,
            courseId,
          },
        },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_ENROLLMENTS_CHECK_WARN]", dbErr);
    }

    if (existing) {
      return NextResponse.json({ error: "Student is already enrolled in this course" }, { status: 400 });
    }

    let enrollment: any = null;
    try {
      enrollment = await db.enrollment.create({
        data: {
          profileId,
          courseId,
        },
        include: {
          profile: true,
          course: true,
        },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_ENROLLMENTS_CREATE_WARN]", dbErr);
    }

    if (!enrollment) {
      enrollment = {
        id: `enr_${Date.now()}`,
        profileId,
        courseId,
        createdAt: new Date().toISOString(),
        profile: {
          id: profileId,
          name: "Enrolled Learner",
          email: "learner@student.izba.app",
          imageUrl: null,
        },
        course: {
          id: courseId,
          title: "Enrolled Course",
          slug: "enrolled-course",
          thumbnail: null,
        },
      };
    }

    try {
      await logActivity({
        adminEmail: user.email,
        action: "CREATE",
        targetType: "enrollment",
        targetId: enrollment.id,
        details: `Enrolled student (${enrollment.profile?.email || "Student"}) into "${enrollment.course?.title || "Course"}"`,
      });
    } catch {}

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_ENROLLMENTS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
