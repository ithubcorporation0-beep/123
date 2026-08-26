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
        muxData: true,
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

    const missingFields: string[] = [];
    if (!chapter.title) missingFields.push("Title");
    if (!chapter.description) missingFields.push("Description");
    if (!chapter.videoUrl && !chapter.muxData?.playbackId) missingFields.push("Video Lecture");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields to publish chapter",
          missingFields,
        },
        { status: 400 }
      );
    }

    const publishedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error: any) {
    console.error("[CHAPTER_PUBLISH_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
