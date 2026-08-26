import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserManagementTable, AdminUserRecord } from "@/components/admin/users/UserManagementTable";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
  }

  const users = await db.profile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedUsers: AdminUserRecord[] = users.map((u) => ({
    id: u.id,
    userId: u.userId,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    createdAt: u.createdAt,
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
