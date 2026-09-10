import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminToken,
  ADMIN_SESSION_COOKIE,
  ADMIN_USER_ID,
  ADMIN_EMAIL,
  ADMIN_NAME,
} from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Admin password is required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password. Please check and try again." },
        { status: 401 }
      );
    }

    // Upsert the master admin profile in Prisma
    try {
      await db.profile.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
          role: Role.admin,
          name: ADMIN_NAME,
          userId: ADMIN_USER_ID,
        },
        create: {
          userId: ADMIN_USER_ID,
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: Role.admin,
        },
      });
    } catch (dbError) {
      console.warn("[ADMIN_AUTH_DB_UPSERT_WARN]", dbError);
    }

    const token = await createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      redirectUrl: "/admin",
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[ADMIN_AUTH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during admin authentication." },
      { status: 500 }
    );
  }
}
