import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseList } from "@/components/teacher/courses/CourseList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function TeacherCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch only this instructor's courses
  const courses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      category: true,
      modules: {
        include: {
          lessons: true,
        },
      },
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Course Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, structure, and publish your technical curriculums, video lectures, and quizzes.
          </p>
        </div>

        <Link href="/teacher/courses/create">
          <Button className="gap-2 rounded-xl shadow-sm font-medium">
            <PlusCircle className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      <CourseList courses={courses} />
    </div>
  );
}
