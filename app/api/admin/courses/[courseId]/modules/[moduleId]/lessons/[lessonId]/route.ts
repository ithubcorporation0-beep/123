import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { lessonId, moduleId } = await params;

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId, moduleId },
      include: { resources: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("[ADMIN_LESSON_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { lessonId, moduleId } = await params;
    const body = await req.json();

    const existing = await db.lesson.findUnique({ where: { id: lessonId, moduleId } });
    if (!existing) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title.trim();
    if (body.content !== undefined) dataToUpdate.content = body.content;
    if (body.description !== undefined) dataToUpdate.content = body.description;
    if (body.videoUrl !== undefined) dataToUpdate.videoUrl = body.videoUrl;
    if (body.videoThumbnail !== undefined) dataToUpdate.videoThumbnail = body.videoThumbnail;
    if (body.duration !== undefined) dataToUpdate.duration = body.duration;
    if (body.isFree !== undefined) dataToUpdate.isFree = Boolean(body.isFree);
    if (body.isPublished !== undefined) dataToUpdate.isPublished = Boolean(body.isPublished);
    if (body.externalUrl !== undefined) dataToUpdate.externalUrl = body.externalUrl;
    if (body.contentType !== undefined) dataToUpdate.contentType = body.contentType;

    const updated = await db.lesson.update({
      where: { id: lessonId, moduleId },
      data: dataToUpdate,
      include: { resources: true },
    });

    if (body.resourceFileUrl) {
      await db.lessonResource.create({
        data: {
          title: body.resourceTitle || "Lesson Document",
          fileUrl: body.resourceFileUrl,
          lessonId,
        },
      });
    }

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "lesson",
      targetId: lessonId,
      details: `Updated lesson: "${updated.title}"`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_LESSON_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { lessonId, moduleId } = await params;

    const existing = await db.lesson.findUnique({
      where: { id: lessonId, moduleId },
      select: { title: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await db.lesson.delete({
      where: { id: lessonId, moduleId },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "lesson",
      targetId: lessonId,
      details: `Deleted lesson: "${existing.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_LESSON_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
