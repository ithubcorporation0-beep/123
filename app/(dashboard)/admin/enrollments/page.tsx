import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EnrollmentManagementView, EnrollmentRecord } from "@/components/admin/enrollments/EnrollmentManagementView";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default async function AdminEnrollmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const [enrollments, allCourses, allStudents] = await Promise.all([
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

  const formatted: EnrollmentRecord[] = enrollments.map((e) => ({
    id: e.id,
    createdAt: e.createdAt,
    profile: e.profile,
    course: e.course,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Enrollment Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Users className="h-3.5 w-3.5 mr-1" /> Registrations CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review real-time course enrollments, filter by student or course, manually assign learners, and revoke registrations.
        </p>
      </div>

      <EnrollmentManagementView
        initialEnrollments={formatted}
        allCourses={allCourses}
        allStudents={allStudents}
      />
    </div>
  );
}
