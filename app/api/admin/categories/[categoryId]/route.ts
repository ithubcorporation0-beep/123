import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

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
    const body = await req.json();
    const { name, description, imageUrl, position } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) {
      dataToUpdate.name = name.trim();
      dataToUpdate.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (description !== undefined) dataToUpdate.description = description?.trim() || null;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl || null;
    if (position !== undefined) dataToUpdate.position = parseInt(position) || 0;

    const updatedCategory = await db.courseCategory.update({
      where: { id: categoryId },
      data: dataToUpdate,
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "category",
      targetId: categoryId,
      details: `Updated category: "${updatedCategory.name}"`,
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

    const coursesCount = await db.course.count({
      where: { categoryId },
    });

    if (coursesCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: it is assigned to ${coursesCount} ${coursesCount === 1 ? "course" : "courses"}. Reassign courses first.`,
        },
        { status: 400 }
      );
    }

    const deletedCategory = await db.courseCategory.delete({
      where: { id: categoryId },
    });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "category",
      targetId: categoryId,
      details: `Deleted category: "${deletedCategory.name}"`,
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
