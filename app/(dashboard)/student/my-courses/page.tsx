import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CourseGrid } from "@/components/student/dashboard/CourseGrid";
import { Search } from "lucide-react";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

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
      createdAt: "desc",
    },
  });

  const formattedCourses = enrollments.map(({ course }) => {
    const totalChapters = course.chapters.length;
    const completedChapters = course.chapters.filter(
      (ch) => ch.userProgress[0]?.isCompleted
    ).length;
    const progressPercent = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    const nextChapter = course.chapters.find(
      (ch) => !ch.userProgress[0]?.isCompleted
    ) || course.chapters[0];

    return {
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      category: course.category,
      instructor: course.instructor,
      completedChapters,
      totalChapters,
      progressPercent,
      nextChapterId: nextChapter?.id || null,
    };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access all your active courses, resume video lessons, and track completion.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" className="rounded-2xl gap-2 font-medium text-xs">
            <Search className="h-4 w-4" />
            Explore More Courses
          </Button>
        </Link>
      </div>

      <CourseGrid courses={formattedCourses} />
    </div>
  );
}
