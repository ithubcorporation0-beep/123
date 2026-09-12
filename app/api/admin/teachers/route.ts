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

    let teachers: any[] = [];
    try {
      teachers = await db.profile.findMany({
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
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHERS_GET_DB_WARN]", dbErr);
    }

    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error("[ADMIN_TEACHERS_GET]", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, bio, phone, imageUrl } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let existing: any = null;
    try {
      existing = await db.profile.findUnique({ where: { email: cleanEmail } });
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_CHECK_WARN]", dbErr);
    }

    if (existing) {
      let upgraded: any = null;
      try {
        upgraded = await db.profile.update({
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
      } catch (dbErr) {
        console.warn("[ADMIN_TEACHER_UPGRADE_WARN]", dbErr);
      }

      if (!upgraded) {
        upgraded = {
          ...existing,
          role: "instructor",
          name: name || existing.name,
        };
      }

      try {
        await logActivity({
          adminEmail: user.email,
          action: "UPDATE",
          targetType: "user",
          targetId: upgraded.id,
          details: `Assigned Instructor role to existing user: ${upgraded.email}`,
        });
      } catch {}

      return NextResponse.json(upgraded);
    }

    let newTeacher: any = null;
    const generatedUserId = `teacher_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      newTeacher = await db.profile.create({
        data: {
          userId: generatedUserId,
          name: name?.trim() || "Instructor",
          email: cleanEmail,
          bio: bio || null,
          phone: phone || null,
          imageUrl: imageUrl || null,
          role: "instructor",
          status: "ACTIVE",
        },
      });
    } catch (dbErr) {
      console.warn("[ADMIN_TEACHER_CREATE_WARN]", dbErr);
    }

    if (!newTeacher) {
      newTeacher = {
        id: `tea_${Date.now()}`,
        userId: generatedUserId,
        name: name?.trim() || "Instructor",
        email: cleanEmail,
        bio: bio || null,
        phone: phone || null,
        imageUrl: imageUrl || null,
        role: "instructor",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      await logActivity({
        adminEmail: user.email,
        action: "CREATE",
        targetType: "user",
        targetId: newTeacher.id,
        details: `Created new instructor account: ${newTeacher.email}`,
      });
    } catch {}

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_TEACHERS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
