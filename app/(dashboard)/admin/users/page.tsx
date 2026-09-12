import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserManagementTable, AdminUserRecord } from "@/components/admin/users/UserManagementTable";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    if (currentUser.role === "instructor") {
      redirect("/teacher");
    }
    redirect("/student");
  }

  let users: any[] = [];
  try {
    users = await db.profile.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.warn("[ADMIN_USERS_QUERY_WARN]", err);
  }

  const formattedUsers: AdminUserRecord[] = (users || []).map((u) => ({
    id: u.id,
    userId: u.userId,
    name: u.name || "User",
    email: u.email || "user@example.com",
    avatar: u.imageUrl || null,
    role: u.role || "student",
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered users and manage role assignments (Student, Instructor, Admin).
        </p>
      </div>

      <UserManagementTable users={formattedUsers} currentUserId={currentUser.id} />
    </div>
  );
}
