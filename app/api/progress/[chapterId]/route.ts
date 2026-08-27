import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chapterId } = await params;
    const body = await req.json();
    const { isCompleted } = body;

    const userProgress = await db.userProgress.upsert({
      where: {
        profileId_chapterId: {
          profileId: user.id,
          chapterId,
        },
      },
      update: {
        isCompleted: Boolean(isCompleted),
      },
      create: {
        profileId: user.id,
        chapterId,
        isCompleted: Boolean(isCompleted),
      },
    });

    return NextResponse.json(userProgress);
  } catch (error: any) {
    console.error("[CHAPTER_PROGRESS_PUT]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
