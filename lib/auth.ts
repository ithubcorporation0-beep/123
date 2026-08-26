import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const user = await currentUser();

  if (!user || !user.id) {
    return null;
  }

  let profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return null;
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User";

    profile = await db.profile.create({
      data: {
        userId: user.id,
        email,
        name,
        imageUrl: user.imageUrl || null,
        role: Role.student,
      },
    });
  }

  return profile;
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
