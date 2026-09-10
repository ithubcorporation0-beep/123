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
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: {
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
        chapters: {
          orderBy: { position: "asc" },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("[ADMIN_COURSE_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body = await req.json();

    const existingCourse = await db.course.findUnique({ where: { id: courseId } });
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (body.title !== undefined) dataToUpdate.title = body.title.trim();
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.thumbnail !== undefined) dataToUpdate.thumbnail = body.thumbnail;
    if (body.bannerUrl !== undefined) dataToUpdate.bannerUrl = body.bannerUrl;
    if (body.introVideoUrl !== undefined) dataToUpdate.introVideoUrl = body.introVideoUrl;
    if (body.duration !== undefined) dataToUpdate.duration = body.duration;
    if (body.level !== undefined) dataToUpdate.level = body.level;
    if (body.price !== undefined) dataToUpdate.price = parseFloat(body.price) || 0;
    if (body.categoryId !== undefined) dataToUpdate.categoryId = body.categoryId || null;
    if (body.instructorId !== undefined) dataToUpdate.instructorId = body.instructorId;
    if (body.isPublished !== undefined) dataToUpdate.isPublished = Boolean(body.isPublished);
    if (body.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(body.isFeatured);
    if (body.status !== undefined) {
      dataToUpdate.status = body.status;
      if (body.status === "PUBLISHED") dataToUpdate.isPublished = true;
      if (body.status === "DRAFT" || body.status === "ARCHIVED") dataToUpdate.isPublished = false;
    }
    if (body.seoTitle !== undefined) dataToUpdate.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) dataToUpdate.seoDescription = body.seoDescription;

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: dataToUpdate,
      include: {
        instructor: true,
        category: true,
      },
    });

    await logActivity({
      adminEmail: currentUser.email,
      action: "UPDATE",
      targetType: "course",
      targetId: courseId,
      details: `Updated course: "${updatedCourse.title}"`,
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("[ADMIN_COURSE_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    await logActivity({
      adminEmail: currentUser.email,
      action: "DELETE",
      targetType: "course",
      targetId: courseId,
      details: `Deleted course: "${course.title}" and associated curriculum`,
    });

    return NextResponse.json(deletedCourse);
  } catch (error: any) {
    console.error("[ADMIN_COURSE_DELETE]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
