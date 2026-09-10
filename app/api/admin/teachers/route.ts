import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = { role: "instructor" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const teachers = await db.profile.findMany({
      where,
      include: {
        coursesCreated: {
          select: { id: true, title: true, slug: true, isPublished: true, price: true },
        },
        _count: {
          select: { coursesCreated: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error("[ADMIN_TEACHERS_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, bio, phone, imageUrl } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await db.profile.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      // If user exists, upgrade to instructor role
      const upgraded = await db.profile.update({
        where: { id: existing.id },
        data: {
          role: "instructor",
          name: name || existing.name,
          bio: bio || existing.bio,
          phone: phone || existing.phone,
          imageUrl: imageUrl || existing.imageUrl,
          status: "ACTIVE",
        },
      });

      await logActivity({
        adminEmail: user.email,
        action: "UPDATE",
        targetType: "user",
        targetId: upgraded.id,
        details: `Assigned Instructor role to existing user: ${upgraded.email}`,
      });

      return NextResponse.json(upgraded);
    }

    const newTeacher = await db.profile.create({
      data: {
        userId: `teacher_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name?.trim() || "New Instructor",
        email: email.trim().toLowerCase(),
        bio: bio || null,
        phone: phone || null,
        imageUrl: imageUrl || null,
        role: "instructor",
        status: "ACTIVE",
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "user",
      targetId: newTeacher.id,
      details: `Created new instructor account: ${newTeacher.email}`,
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_TEACHERS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
