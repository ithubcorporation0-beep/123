import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        profileId: user.id,
      },
      include: {
        course: {
          include: {
            category: true,
            instructor: true,
            chapters: {
              where: {
                isPublished: true,
              },
              orderBy: {
                position: "asc",
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(enrollments);
  } catch (error: any) {
    console.error("[ENROLLMENTS_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
