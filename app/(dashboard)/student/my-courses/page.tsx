import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PlayCircle, Search } from "lucide-react";

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access all your active courses, track your learning progress, and earn certificates.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" className="rounded-xl gap-2 font-medium text-xs">
            <Search className="h-4 w-4" />
            Explore More Courses
          </Button>
        </Link>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ course }) => {
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

            return (
              <Card
                key={course.id}
                className="rounded-2xl border bg-card overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-video w-full bg-muted/40 border-b">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-muted">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    {course.category && (
                      <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold" variant="outline">
                        {course.category.name}
                      </Badge>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-foreground line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Instructor: <strong className="text-foreground">{course.instructor?.name || "EduFlow Instructor"}</strong>
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>{progressPercent}% completed</span>
                        <span>{completedChapters}/{totalChapters} lessons</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 rounded-full" />
                    </div>
                  </div>
                </div>

                <CardFooter className="p-5 pt-0">
                  <Link
                    href={nextChapter ? `/student/learn/${course.id}/${nextChapter.id}` : `/courses/${course.id}`}
                    className="w-full"
                  >
                    <Button size="sm" className="w-full rounded-xl gap-2 font-medium text-xs shadow-xs">
                      <PlayCircle className="h-3.5 w-3.5" />
                      {progressPercent > 0 ? "Resume Course" : "Start Course"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-3xl border shadow-sm p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/50">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg text-foreground">You haven't enrolled in any courses yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
            Explore our catalog of free interactive courses in web development, design, and cloud technologies.
          </p>
          <Link href="/courses" className="mt-6">
            <Button className="gap-2 rounded-2xl font-bold px-6">
              <Search className="h-4 w-4" />
              Explore Course Catalog
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
