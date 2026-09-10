import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_USER_ID,
  ADMIN_EMAIL,
  ADMIN_NAME,
  verifyAdminToken,
} from "@/lib/admin-auth";

export async function getCurrentUser() {
  try {
    // 1. Check for dedicated Admin Passcode session
    try {
      const cookieStore = await cookies();
      const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
      if (adminToken && (await verifyAdminToken(adminToken))) {
        let adminProfile = await db.profile.findFirst({
          where: {
            OR: [
              { userId: ADMIN_USER_ID },
              { email: ADMIN_EMAIL },
              { role: Role.admin },
            ],
          },
        });

        if (!adminProfile) {
          adminProfile = await db.profile.create({
            data: {
              userId: ADMIN_USER_ID,
              email: ADMIN_EMAIL,
              name: ADMIN_NAME,
              role: Role.admin,
            },
          });
        } else if (adminProfile.role !== Role.admin) {
          adminProfile = await db.profile.update({
            where: { id: adminProfile.id },
            data: { role: Role.admin },
          });
        }

        return adminProfile;
      }
    } catch {
      // In static generation or outside request context, proceed to Clerk
    }

    const user = await currentUser();

    if (!user || !user.id) {
      return null;
    }

    let profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    const email = user.emailAddresses?.[0]?.emailAddress;

    // If profile not found by userId, check by email to link existing records (e.g. seeded or re-authenticated)
    if (!profile && email) {
      profile = await db.profile.findUnique({
        where: { email },
      });

      if (profile) {
        profile = await db.profile.update({
          where: { id: profile.id },
          data: {
            userId: user.id,
            name: [user.firstName, user.lastName].filter(Boolean).join(" ") || profile.name,
            imageUrl: user.imageUrl || profile.imageUrl,
          },
        });
      }
    }

    if (!profile) {
      if (!email) {
        return null;
      }

      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User";

      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const isDefaultAdmin =
        adminEmails.includes(email.toLowerCase()) ||
        email.toLowerCase().startsWith("admin@") ||
        email.toLowerCase().includes("admin");

      profile = await db.profile.create({
        data: {
          userId: user.id,
          email,
          name,
          imageUrl: user.imageUrl || null,
          role: isDefaultAdmin ? Role.admin : Role.student,
        },
      });
    }

    return profile;
  } catch (error) {
    console.error("[GET_CURRENT_USER_ERROR]", error);
    return null;
  }
}

export async function requireAuth() {
  const profile = await getCurrentUser();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(allowedRoles: Role[]) {
  const profile = await requireAuth();

  if (!allowedRoles.includes(profile.role)) {
    if (profile.role === Role.admin) redirect("/admin");
    if (profile.role === Role.instructor) redirect("/instructor");
    redirect("/student");
  }

  return profile;
}
