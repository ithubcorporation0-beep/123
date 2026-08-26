import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { categoryId } = await params;
    const { name, description } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const updatedCategory = await db.courseCategory.update({
      where: { id: categoryId },
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("[ADMIN_CATEGORY_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { categoryId } = await params;

    // Check if category has courses attached
    const coursesCount = await db.course.count({
      where: { categoryId },
    });

    if (coursesCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: it is currently assigned to ${coursesCount} ${coursesCount === 1 ? "course" : "courses"}. Please reassign or delete the courses first.`,
        },
        { status: 400 }
      );
    }

    const deletedCategory = await db.courseCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(deletedCategory);
  } catch (error: any) {
    console.error("[ADMIN_CATEGORY_DELETE]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
