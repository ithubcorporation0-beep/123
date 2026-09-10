import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { courseId, moduleId } = await params;
    const body = await req.json();
    const {
      title,
      description,
      content,
      videoUrl,
      videoThumbnail,
      duration,
      isFree = false,
      isPublished = true,
      externalUrl,
      contentType = "VIDEO",
      resourceFileUrl,
      resourceTitle,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Lesson title is required" }, { status: 400 });
    }

    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const lesson = await db.lesson.create({
      data: {
        title: title.trim(),
        content: content || description || null,
        videoUrl: videoUrl || null,
        videoThumbnail: videoThumbnail || null,
        duration: duration || null,
        externalUrl: externalUrl || null,
        isFree: Boolean(isFree),
        isPublished: Boolean(isPublished),
        contentType: contentType || "VIDEO",
        position: newPosition,
        moduleId,
        resources: resourceFileUrl
          ? {
              create: {
                title: resourceTitle || "Lesson Resource",
                fileUrl: resourceFileUrl,
              },
            }
          : undefined,
      },
      include: {
        resources: true,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "lesson",
      targetId: lesson.id,
      details: `Added lesson "${lesson.title}" to module ${moduleId}`,
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_LESSONS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { list } = await req.json();

    if (!Array.isArray(list)) {
      return NextResponse.json({ error: "Invalid lesson list" }, { status: 400 });
    }

    for (const item of list) {
      await db.lesson.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_LESSONS_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
