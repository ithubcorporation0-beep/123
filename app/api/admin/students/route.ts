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
    const status = searchParams.get("status") || "";

    const where: any = { role: "student" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }

    const students = await db.profile.findMany({
      where,
      include: {
        enrollments: {
          include: {
            course: {
              select: { id: true, title: true, slug: true, thumbnail: true },
            },
          },
        },
        certificates: {
          include: {
            course: { select: { title: true } },
          },
        },
        _count: {
          select: { enrollments: true, lessonProgress: true, certificates: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error: any) {
    console.error("[ADMIN_STUDENTS_GET]", error);
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
    const { name, email, phone, bio } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await db.profile.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    const newStudent = await db.profile.create({
      data: {
        userId: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name?.trim() || null,
        email: email.trim().toLowerCase(),
        phone: phone || null,
        bio: bio || null,
        role: "student",
        status: "ACTIVE",
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "user",
      targetId: newStudent.id,
      details: `Created student account: ${newStudent.email}`,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_STUDENTS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
