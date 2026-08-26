import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminCourseTable, AdminCourseRecord } from "@/components/admin/courses/AdminCourseTable";

export default async function AdminCoursesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Course Catalog Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, publish/unpublish, feature, and moderate all courses created across the platform.
        </p>
      </div>

      <AdminCourseTable courses={formattedCourses} />
    </div>
  );
}
