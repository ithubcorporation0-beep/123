import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_USER_ID } from "@/lib/admin-auth";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    let profile = await db.profile.findFirst({
      where: {
        OR: [{ role: Role.admin }, { email: ADMIN_EMAIL }],
      },
    });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId: ADMIN_USER_ID,
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: Role.admin,
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json({
      profile,
      role: "admin",
      portalRole: "System Administrator / Platform Owner",
    });
  } catch (error: any) {
    console.error("[ADMIN_PROFILE_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, bio, imageUrl } = body;

    let adminProfile = await db.profile.findFirst({
      where: {
        OR: [{ role: Role.admin }, { email: ADMIN_EMAIL }],
      },
    });

    if (!adminProfile) {
      adminProfile = await db.profile.create({
        data: {
          userId: ADMIN_USER_ID,
          email: ADMIN_EMAIL,
          name: name || ADMIN_NAME,
          role: Role.admin,
          status: "ACTIVE",
          phone: phone || null,
          bio: bio || null,
          imageUrl: imageUrl || null,
        },
      });
    } else {
      adminProfile = await db.profile.update({
        where: { id: adminProfile.id },
        data: {
          name: name !== undefined ? name : adminProfile.name,
          phone: phone !== undefined ? phone : adminProfile.phone,
          bio: bio !== undefined ? bio : adminProfile.bio,
          imageUrl: imageUrl !== undefined ? imageUrl : adminProfile.imageUrl,
        },
      });
    }

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "user",
      targetId: adminProfile.id,
      details: `Updated admin profile settings for "${adminProfile.name}"`,
    });

    return NextResponse.json({
      success: true,
      profile: adminProfile,
    });
  } catch (error: any) {
    console.error("[ADMIN_PROFILE_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
