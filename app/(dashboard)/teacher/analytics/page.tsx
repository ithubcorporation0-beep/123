import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  EnrollmentChart,
  DayData,
  CourseAnalyticsBreakdown,
} from "@/components/teacher/analytics/EnrollmentChart";

export default async function TeacherAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch teacher's courses with chapters and all enrollments
  const courses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: true,
        },
      },
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 1. Calculate Daily Enrollments for the past 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyMap[label] = 0;
  }

  courses.forEach((course) => {
    course.enrollments.forEach((enrollment) => {
      const enrolledDate = new Date(enrollment.createdAt);
      if (enrolledDate >= thirtyDaysAgo) {
        const label = enrolledDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (dailyMap[label] !== undefined) {
          dailyMap[label] += 1;
        }
      }
    });
  });

  const dailyData: DayData[] = Object.entries(dailyMap).map(([date, enrollments]) => ({
    date,
    enrollments,
  }));

  // 2. Calculate per-course performance metrics
  const coursesBreakdown: CourseAnalyticsBreakdown[] = courses.map((course) => {
    const totalStudents = course.enrollments.length;
    const totalChapters = course.chapters.length;

    let averageCompletion = 0;
    if (totalStudents > 0 && totalChapters > 0) {
      let totalStudentPercentages = 0;
      course.enrollments.forEach((enrollment) => {
        const studentCompleted = course.chapters.filter((ch) =>
          ch.userProgress.some(
            (up) => up.profileId === enrollment.profileId && up.isCompleted
          )
        ).length;
        totalStudentPercentages += (studentCompleted / totalChapters) * 100;
      });
      averageCompletion = Math.round(totalStudentPercentages / totalStudents);
    }

    return {
      id: course.id,
      title: course.title,
      isPublished: course.isPublished,
      totalStudents,
      totalChapters,
      averageCompletion,
    };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Analytics & Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track student acquisition trends, engagement levels, and completion rates over time.
        </p>
      </div>

      <EnrollmentChart dailyData={dailyData} coursesBreakdown={coursesBreakdown} />
    </div>
  );
}
