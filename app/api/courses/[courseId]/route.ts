import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateCourseSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
  price: z.number().min(0).optional(),
  thumbnail: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/courses/[courseId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            bio: true,
          },
        },
        category: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            position: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/courses/[courseId] & PATCH /api/courses/[courseId]
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

    const parsed = updateCourseSchema.safeParse(body);
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

    // Ownership check: must be owner or admin
    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit this course" },
        { status: 403 }
      );
    }

    const data: any = { ...parsed.data };

    if (data.imageUrl !== undefined) {
      data.thumbnail = data.imageUrl;
      delete data.imageUrl;
    }

    // Update slug if title is updated
    if (data.title && data.title !== course.title) {
      let slug = generateSlug(data.title);
      const existingSlug = await db.course.findFirst({
        where: {
          slug,
          NOT: { id: courseId },
        },
      });
      if (existingSlug) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
      data.slug = slug;
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  return PUT(req, context);
}

// DELETE /api/courses/[courseId]
export async function DELETE(
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
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Ownership check: must be owner or admin
    if (course.instructorId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this course" },
        { status: 403 }
      );
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
