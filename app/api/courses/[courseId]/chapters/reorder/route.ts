import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const reorderSchema = z.object({
  list: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();

    const parsed = reorderSchema.safeParse(body);
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

    // Ownership check
    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not own this course" },
        { status: 403 }
      );
    }

    const { list } = parsed.data;

    // Update positions in parallel / transaction
    await db.$transaction(
      list.map((item) =>
        db.chapter.update({
          where: {
            id: item.id,
            courseId,
          },
          data: {
            position: item.position,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAPTERS_REORDER_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
