import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateChapterSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  description: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  isFree: z.boolean().optional(),
  isPreview: z.boolean().optional(),
  position: z.number().optional(),
});

// GET /api/courses/[courseId]/chapters/[chapterId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTER_ID_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/courses/[courseId]/chapters/[chapterId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = await params;
    const body = await req.json();

    const parsed = updateChapterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not own this course" },
        { status: 403 }
      );
    }

    const updateData: any = { ...parsed.data };
    if (updateData.isPreview !== undefined) {
      updateData.isFree = updateData.isPreview;
      delete updateData.isPreview;
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: updateData,
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTER_ID_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  return PUT(req, context);
}

// DELETE /api/courses/[courseId]/chapters/[chapterId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not own this course" },
        { status: 403 }
      );
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    // If no published chapters exist anymore, unpublish the course
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedChapters.length === 0 && course.isPublished) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_ID_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
