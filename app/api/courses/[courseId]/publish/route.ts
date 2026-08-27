import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Ownership check
    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not own this course" },
        { status: 403 }
      );
    }

    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

    const missingFields: string[] = [];
    if (!course.title) missingFields.push("Title");
    if (!course.description) missingFields.push("Description");
    if (!course.thumbnail) missingFields.push("Course Image");
    if (!course.categoryId) missingFields.push("Category");
    if (!hasPublishedChapter) missingFields.push("At least one published chapter");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields to publish course",
          missingFields,
        },
        { status: 400 }
      );
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error: any) {
    console.error("[COURSE_PUBLISH_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
