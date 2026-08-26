import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatsCards } from "@/components/teacher/dashboard/StatsCards";
import { RecentEnrollments, RecentEnrollmentItem } from "@/components/teacher/dashboard/RecentEnrollments";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all courses owned by this instructor
  const courses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      chapters: true,
      enrollments: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);

  // Aggregate all enrollments across teacher's courses
  const allEnrollments: RecentEnrollmentItem[] = [];
  courses.forEach((course) => {
    course.enrollments.forEach((enrollment) => {
      allEnrollments.push({
        id: enrollment.id,
        studentName: enrollment.profile.name || "Student",
        studentEmail: enrollment.profile.email,
        studentAvatar: enrollment.profile.imageUrl,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: enrollment.createdAt,
      });
    });
  });

  // Sort descending by enrolled date and take top 8
  const recentEnrollments = allEnrollments
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 8);

  const totalStudents = allEnrollments.length;
  const firstName = user.name ? user.name.split(" ")[0] : "Instructor";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Welcome back, {firstName}! 🎓
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your courses, active learners, and engagement metrics.
          </p>
        </div>

        <Link href="/teacher/courses/create">
          <Button className="rounded-2xl gap-2 font-bold text-xs shadow-sm">
            <PlusCircle className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalCourses={totalCourses}
        publishedCourses={publishedCourses}
        totalStudents={totalStudents}
        totalChapters={totalChapters}
      />

      {/* Recent Enrollments Table */}
      <div className="space-y-4">
        <RecentEnrollments enrollments={recentEnrollments} />
      </div>
    </div>
  );
}
