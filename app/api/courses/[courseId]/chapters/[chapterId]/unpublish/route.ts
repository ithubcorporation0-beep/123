import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = await params;

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        course: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Ownership check
    if (chapter.course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not own this course" },
        { status: 403 }
      );
    }

    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        isPublished: false,
      },
    });

    // Check remaining published chapters in this course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    // If no published chapters remain, auto-unpublish the parent course
    if (publishedChaptersInCourse.length === 0) {
      await db.course.update({
        where: { id: courseId },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error: any) {
    console.error("[CHAPTER_UNPUBLISH_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
