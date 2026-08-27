import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
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
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Published course not found" },
        { status: 404 }
      );
    }

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        profileId_courseId: {
          profileId: user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          error: "Already enrolled",
          firstChapterId: course.chapters[0]?.id,
        },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.create({
      data: {
        profileId: user.id,
        courseId,
      },
    });

    return NextResponse.json(
      {
        enrollment,
        firstChapterId: course.chapters[0]?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[COURSE_ENROLL_POST]", error);
    // Unique constraint error check
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
