import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const categoryId = searchParams.get("categoryId") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;
    if (status === "archived") where.status = "ARCHIVED";
    if (categoryId && categoryId !== "all") where.categoryId = categoryId;

    const courses = await db.course.findMany({
      where,
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        chapters: true,
        enrollments: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("[ADMIN_COURSES_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      categoryId,
      instructorId,
      thumbnail,
      bannerUrl,
      introVideoUrl,
      level = "BEGINNER",
      duration,
      price = 0,
      status = "DRAFT",
      seoTitle,
      seoDescription,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    }

    let slug = generateSlug(title);
    const existing = await db.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Determine instructor: passed or fallback to current admin profile
    let assignedInstructorId = instructorId;
    if (!assignedInstructorId) {
      assignedInstructorId = currentUser.id;
    }

    const isPublished = status === "PUBLISHED";

    const newCourse = await db.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description || null,
        categoryId: categoryId || null,
        instructorId: assignedInstructorId,
        thumbnail: thumbnail || null,
        bannerUrl: bannerUrl || null,
        introVideoUrl: introVideoUrl || null,
        level: level || "BEGINNER",
        duration: duration || null,
        price: parseFloat(price) || 0,
        status: status || "DRAFT",
        isPublished,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
      include: {
        instructor: true,
        category: true,
      },
    });

    await logActivity({
      adminEmail: currentUser.email,
      action: "CREATE",
      targetType: "course",
      targetId: newCourse.id,
      details: `Created new course: "${newCourse.title}"`,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_COURSES_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
