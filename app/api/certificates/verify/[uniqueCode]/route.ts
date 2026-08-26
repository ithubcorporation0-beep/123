import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uniqueCode: string }> }
) {
  try {
    const { uniqueCode } = await params;

    const certificate = await db.certificate.findUnique({
      where: {
        certificateCode: uniqueCode,
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        profile: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          valid: false,
          error: "Certificate not found or invalid credential ID",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificateCode: certificate.certificateCode,
      studentName: certificate.profile.name || "Student",
      courseTitle: certificate.course.title,
      instructorName: certificate.course.instructor?.name || "EduFlow Instructor",
      issueDate: certificate.issuedAt,
    });
  } catch (error: any) {
    console.error("[CERTIFICATE_VERIFY_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
