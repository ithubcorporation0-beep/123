import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminCourseTable, AdminCourseRecord } from "@/components/admin/courses/AdminCourseTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function AdminCoursesPage() {
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

  const courses = await db.course.findMany({
    include: {
      instructor: true,
      category: true,
      chapters: true,
      enrollments: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });

  const formattedCourses: AdminCourseRecord[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    thumbnail: c.thumbnail,
    categoryName: c.category?.name || "Uncategorized",
    instructorName: c.instructor?.name || "Instructor",
    instructorAvatar: c.instructor?.imageUrl,
    isPublished: c.isPublished,
    isFeatured: Boolean(c.isFeatured),
    enrolledStudentsCount: c.enrollments.length,
    chaptersCount: c.chapters.length,
    createdAt: c.createdAt,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Course Management & Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create courses, upload course images, edit curriculum, and manage publication.
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="rounded-2xl gap-2 font-semibold shadow-sm">
            <PlusCircle className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      <AdminCourseTable courses={formattedCourses} />
    </div>
  );
}
