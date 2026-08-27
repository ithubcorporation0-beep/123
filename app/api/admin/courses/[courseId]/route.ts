import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body = await req.json();
    const { isPublished, isFeatured } = body;

    const dataToUpdate: any = {};
    if (isPublished !== undefined) dataToUpdate.isPublished = Boolean(isPublished);
    if (isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(isFeatured);

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("[ADMIN_COURSE_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { courseId } = await params;

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error: any) {
    console.error("[ADMIN_COURSE_DELETE]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
