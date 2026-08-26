import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                profileId: user.id,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.chapters.length === 0) {
      return NextResponse.json(
        { error: "Course has no published lessons" },
        { status: 400 }
      );
    }

    // Check if every published chapter is completed
    const allChaptersCompleted = course.chapters.every(
      (chapter) => chapter.userProgress[0]?.isCompleted
    );

    if (!allChaptersCompleted) {
      return NextResponse.json(
        { error: "You must complete every chapter before generating a certificate." },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = await db.certificate.findUnique({
      where: {
        profileId_courseId: {
          profileId: user.id,
          courseId,
        },
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

    if (existingCertificate) {
      return NextResponse.json(existingCertificate);
    }

    // Generate unique verifiable certificate code
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const timeCode = Date.now().toString(36).toUpperCase();
    const certificateCode = `EDU-${randomHex}-${timeCode}`;

    const newCertificate = await db.certificate.create({
      data: {
        certificateCode,
        profileId: user.id,
        courseId,
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

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error: any) {
    console.error("[CERTIFICATE_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await db.certificate.findMany({
      where: {
        profileId: user.id,
      },
      include: {
        course: {
          include: {
            instructor: true,
            category: true,
          },
        },
        profile: true,
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("[CERTIFICATES_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
