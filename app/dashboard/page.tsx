import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === Role.admin) {
    redirect("/admin");
  }

  if (user.role === Role.instructor) {
    redirect("/instructor");
  }

  redirect("/student");
}
