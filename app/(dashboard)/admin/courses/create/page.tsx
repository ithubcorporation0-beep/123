import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminCourseCreateForm } from "@/components/admin/courses/AdminCourseCreateForm";

export default async function AdminCreateCoursePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/admin/login");
  }

  const [categories, instructors] = await Promise.all([
    db.courseCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.profile.findMany({
      where: {
        OR: [{ role: "instructor" }, { role: "admin" }],
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
              Create New Course
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
              <Shield className="h-3 w-3 mr-1" /> Admin Panel
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the initial course details and thumbnail. You will be able to manage full modules, lessons, and media immediately.
          </p>
        </div>
      </div>

      <AdminCourseCreateForm categories={categories} instructors={instructors} />
    </div>
  );
}
