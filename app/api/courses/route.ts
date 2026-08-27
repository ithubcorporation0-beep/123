import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
});

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// POST /api/courses - Create a new course (Teacher/Admin only)
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

    const body = await req.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { title } = parsed.data;
    let slug = generateSlug(title);

    // Ensure slug uniqueness
    const existingSlug = await db.course.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const course = await db.course.create({
      data: {
        title,
        slug,
        instructorId: user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/courses - List all published courses with relations and counts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
        ...(search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
      },
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              select: {
                id: true,
                title: true,
                position: true,
                isFree: true,
                contentType: true,
              },
            },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
