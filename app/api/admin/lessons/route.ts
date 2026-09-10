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
    const moduleId = searchParams.get("moduleId");
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (moduleId && moduleId !== "all") {
      where.moduleId = moduleId;
    } else if (courseId && courseId !== "all") {
      where.module = { courseId };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const lessons = await db.lesson.findMany({
      where,
      include: {
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: { id: true, title: true, slug: true, thumbnail: true },
            },
          },
        },
        resources: true,
      },
      orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
    });

    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error("[ADMIN_LESSONS_GLOBAL_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      moduleId,
      title,
      description,
      videoUrl,
      videoThumbnail,
      duration,
      isFree = false,
      isPublished = true,
      resourceFileUrl,
      resourceTitle,
      textContent,
      contentType = "VIDEO",
    } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Lesson title is required" }, { status: 400 });
    }

    const targetModule = await db.courseModule.findUnique({
      where: { id: moduleId },
      include: { course: { select: { title: true } } },
    });

    if (!targetModule) {
      return NextResponse.json({ error: "Target module not found" }, { status: 404 });
    }

    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const lessonItem = await db.lesson.create({
      data: {
        title: title.trim(),
        content: textContent || description || null,
        videoUrl: videoUrl || null,
        videoThumbnail: videoThumbnail || null,
        duration: duration || null,
        isFree: Boolean(isFree),
        isPublished: Boolean(isPublished),
        contentType: contentType || "VIDEO",
        position: newPosition,
        moduleId,
      },
      include: {
        resources: true,
        module: {
          select: {
            id: true,
            title: true,
            course: { select: { title: true } },
          },
        },
      },
    });

    if (resourceFileUrl) {
      await db.lessonResource.create({
        data: {
          title: resourceTitle || "Document Resource",
          fileUrl: resourceFileUrl,
          lessonId: lessonItem.id,
        },
      });
    }

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "lesson",
      targetId: lessonItem.id,
      details: `Created lesson "${lessonItem.title}" in module "${targetModule.title}" ("${targetModule.course?.title}")`,
    });

    return NextResponse.json(lessonItem, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_LESSONS_GLOBAL_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    await Promise.all(
      items.map((item) =>
        db.lesson.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_LESSONS_GLOBAL_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
