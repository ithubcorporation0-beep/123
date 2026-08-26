import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { userId } = await params;
    const body = await req.json();
    const { role } = body;

    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    const targetProfile = await db.profile.findFirst({
      where: {
        OR: [{ id: userId }, { userId }],
      },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from revoking their own admin privileges
    if (targetProfile.id === currentUser.id && role !== "admin") {
      return NextResponse.json(
        { error: "Cannot remove your own admin privileges" },
        { status: 400 }
      );
    }

    // 1. Update Database Profile
    const updatedProfile = await db.profile.update({
      where: { id: targetProfile.id },
      data: { role },
    });

    // 2. Sync to Clerk publicMetadata via backend SDK
    if (targetProfile.userId) {
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(targetProfile.userId, {
          publicMetadata: {
            role,
          },
        });
      } catch (clerkErr) {
        console.warn("[CLERK_METADATA_SYNC_WARN]", clerkErr);
      }
    }

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error("[ADMIN_ROLE_PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
