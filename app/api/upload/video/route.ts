import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mux } from "@/lib/mux";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Instructor or Admin role required" },
        { status: 403 }
      );
    }

    const { chapterId } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
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

    // Create Mux Direct Upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "none",
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (error: any) {
    console.error("[VIDEO_UPLOAD_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
