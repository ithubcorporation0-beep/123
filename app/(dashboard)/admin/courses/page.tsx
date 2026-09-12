import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
import { AdminCourseTable, AdminCourseRecord } from "@/components/admin/courses/AdminCourseTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";

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

  let courses: any[] = [];
  try {
    courses = await db.course.findMany({
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
  } catch (err) {
    console.warn("[ADMIN_COURSES_QUERY_WARN]", err);
  }

  let formattedCourses: AdminCourseRecord[] = (courses || []).map((c) => ({
    id: c.id,
    title: c.title || "Course",
    slug: c.slug || "course",
    thumbnail: c.thumbnail || null,
    categoryName: c.category?.name || "Uncategorized",
    instructorName: c.instructor?.name || "Instructor",
    instructorAvatar: c.instructor?.imageUrl || null,
    isPublished: Boolean(c.isPublished),
    isFeatured: Boolean(c.isFeatured),
    enrolledStudentsCount: c.enrollments?.length ?? 0,
    chaptersCount: c.chapters?.length ?? 0,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
  }));

  if (formattedCourses.length === 0) {
    formattedCourses = FALLBACK_COURSES.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      thumbnail: c.thumbnail,
      categoryName: c.category?.name || "General",
      instructorName: c.instructor?.name || "Instructor",
      instructorAvatar: c.instructor?.imageUrl,
      isPublished: true,
      isFeatured: Boolean(c.isFeatured),
      enrolledStudentsCount: c.enrollmentsCount || 0,
      chaptersCount: c.chapters?.length || 0,
      createdAt: new Date().toISOString(),
    }));
  }

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
        <div className="flex items-center gap-2">
          <Link href="/admin/manage">
            <Button variant="outline" className="rounded-[10px] gap-2 font-semibold shadow-xs bg-card border-border hover:bg-muted">
              <Sparkles className="h-4 w-4 text-accent" />
              Add / Remove Panel
            </Button>
          </Link>
          <Link href="/admin/courses/create">
            <Button className="rounded-[10px] gap-2 font-semibold shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.4)]">
              <PlusCircle className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </div>
      </div>

      <AdminCourseTable courses={formattedCourses} />
    </div>
  );
}
