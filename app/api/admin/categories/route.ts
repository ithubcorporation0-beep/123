import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { name, description, imageUrl, position } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const last = await db.courseCategory.findFirst({
      orderBy: { position: "desc" },
    });
    const nextPos = position !== undefined ? parseInt(position) : (last ? last.position + 1 : 1);

    const category = await db.courseCategory.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        position: nextPos,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "category",
      targetId: category.id,
      details: `Created category: "${category.name}"`,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_CATEGORY_POST]", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { list } = await req.json();

    if (!Array.isArray(list)) {
      return NextResponse.json({ error: "Invalid category order list" }, { status: 400 });
    }

    for (const item of list) {
      await db.courseCategory.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "category",
      details: "Reordered course categories taxonomy",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_CATEGORIES_REORDER]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await db.courseCategory.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: [{ position: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("[ADMIN_CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
