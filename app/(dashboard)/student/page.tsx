import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ContinueLearning } from "@/components/student/dashboard/ContinueLearning";
import { BookOpen, CheckCircle2, GraduationCap, Award } from "lucide-react";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all enrollments for this student with chapters and progress
  const enrollments = await db.enrollment.findMany({
    where: {
      profileId: user.id,
    },
    include: {
      course: {
        include: {
          category: true,
          instructor: true,
          chapters: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
            include: {
              userProgress: {
                where: {
                  profileId: user.id,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalEnrolled = enrollments.length;

  let totalCompletedChapters = 0;
  let completedCoursesCount = 0;

  // Process courses metrics
  const processedCourses = enrollments.map(({ course }) => {
    const totalChapters = course.chapters.length;
    const completedChapters = course.chapters.filter(
      (ch) => ch.userProgress[0]?.isCompleted
    ).length;

    totalCompletedChapters += completedChapters;

    const isCourseCompleted = totalChapters > 0 && completedChapters === totalChapters;
    if (isCourseCompleted) {
      completedCoursesCount += 1;
    }

    const progressPercent = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    const firstIncompleteChapter = course.chapters.find(
      (ch) => !ch.userProgress[0]?.isCompleted
    ) || course.chapters[0];

    // Find the latest progress timestamp for recent activity sorting
    const latestActivityTime = course.chapters.reduce((latest, ch) => {
      const progressUpdatedAt = ch.userProgress[0]?.updatedAt;
      if (!progressUpdatedAt) return latest;
      return progressUpdatedAt > latest ? progressUpdatedAt : latest;
    }, new Date(0));

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      instructor: course.instructor,
      nextChapterId: firstIncompleteChapter?.id || "",
      nextChapterTitle: firstIncompleteChapter?.title || "Start learning",
      completedChaptersCount: completedChapters,
      totalChaptersCount: totalChapters,
      progressPercent,
      latestActivityTime,
    };
  });

  // Find the most recently active course
  const mostRecentCourse = processedCourses.length > 0
    ? [...processedCourses].sort((a, b) => b.latestActivityTime.getTime() - a.latestActivityTime.getTime())[0]
    : null;

  const firstName = user.name ? user.name.split(" ")[0] : "Student";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Greeting */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Here is a summary of your learning journey. Keep up the momentum and achieve your goals.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-3xl border bg-card shadow-xs">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Courses Enrolled</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{totalEnrolled}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card shadow-xs">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Courses Completed</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{completedCoursesCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card shadow-xs">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Lessons Completed</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{totalCompletedChapters}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Featured Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">In Progress</h2>
        </div>

        <ContinueLearning course={mostRecentCourse} />
      </div>
    </div>
  );
}
