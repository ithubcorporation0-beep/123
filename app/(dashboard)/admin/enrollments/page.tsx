import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
import { EnrollmentManagementView, EnrollmentRecord } from "@/components/admin/enrollments/EnrollmentManagementView";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default async function AdminEnrollmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let dbEnrollments: any[] = [];
  let dbCourses: any[] = [];
  let dbStudents: any[] = [];

  try {
    const results = await Promise.allSettled([
      db.enrollment.findMany({
        include: {
          profile: {
            select: { id: true, name: true, email: true, imageUrl: true },
          },
          course: {
            select: { id: true, title: true, slug: true, thumbnail: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.course.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
      }),
      db.profile.findMany({
        where: { role: "student" },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      }),
    ]);

    if (results[0].status === "fulfilled" && Array.isArray(results[0].value)) {
      dbEnrollments = results[0].value;
    }
    if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
      dbCourses = results[1].value;
    }
    if (results[2].status === "fulfilled" && Array.isArray(results[2].value)) {
      dbStudents = results[2].value;
    }
  } catch (err) {
    console.warn("[ADMIN_ENROLLMENTS_WARN]", err);
  }

  // Fallbacks if tables are empty
  if (dbCourses.length === 0) {
    dbCourses = FALLBACK_COURSES.map((c) => ({ id: c.id, title: c.title }));
  }

  const formatted: EnrollmentRecord[] = dbEnrollments
    .filter((e) => Boolean(e && e.profile && e.course))
    .map((e) => ({
      id: e.id,
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
      profile: {
        id: e.profile.id,
        name: e.profile.name || "Student",
        email: e.profile.email || "student@example.com",
        imageUrl: e.profile.imageUrl || null,
      },
      course: {
        id: e.course.id,
        title: e.course.title || "Course",
        slug: e.course.slug || "course",
        thumbnail: e.course.thumbnail || null,
      },
    }));

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Enrollment Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold rounded-[10px]">
            <Users className="h-3.5 w-3.5 mr-1" /> Registrations CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review real-time course enrollments, filter by student or course, manually assign learners, and revoke registrations.
        </p>
      </div>

      <EnrollmentManagementView
        initialEnrollments={formatted}
        allCourses={dbCourses}
        allStudents={dbStudents}
      />
    </div>
  );
}
