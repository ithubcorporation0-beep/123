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

    const certificates = await db.certificate.findMany({
      include: {
        profile: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("[ADMIN_CERTIFICATES_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { profileId, courseId } = body;

    if (!profileId || !courseId) {
      return NextResponse.json({ error: "Student ID and Course ID required" }, { status: 400 });
    }

    const certificateCode = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const cert = await db.certificate.upsert({
      where: {
        profileId_courseId: { profileId, courseId },
      },
      update: {
        certificateCode,
        issuedAt: new Date(),
        status: "ISSUED",
      },
      create: {
        certificateCode,
        profileId,
        courseId,
        status: "ISSUED",
      },
      include: {
        profile: true,
        course: true,
      },
    });

    await logActivity({
      adminEmail: user.email,
      action: "CREATE",
      targetType: "certificate",
      targetId: cert.id,
      details: `Issued certificate ${cert.certificateCode} to ${cert.profile.email} for "${cert.course.title}"`,
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_CERTIFICATES_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
