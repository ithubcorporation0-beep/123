import Link from "next/link";
import Image from "next/image";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";

export interface EnrolledCourseItem {
  id: string;
  title: string;
  thumbnail: string | null;
  category?: { name: string } | null;
  instructor?: { name: string | null } | null;
  completedChapters: number;
  totalChapters: number;
  progressPercent: number;
  nextChapterId: string | null;
}

interface CourseGridProps {
  courses: EnrolledCourseItem[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses enrolled yet"
        description="You haven't enrolled in any courses yet. Browse our comprehensive curriculum to kickstart your learning journey."
        actionLabel="Browse Courses"
        actionHref="/courses"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const isFinished = course.progressPercent === 100 && course.totalChapters > 0;
        const targetUrl = course.nextChapterId
          ? `/student/learn/${course.id}/${course.nextChapterId}`
          : `/courses/${course.id}`;

        return (
          <Card
            key={course.id}
            className="rounded-3xl border bg-card overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
          >
            <div>
              {/* Thumbnail */}
              <Link href={targetUrl} className="relative aspect-video w-full block overflow-hidden bg-muted/40 border-b">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
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
                {isFinished && (
                  <Badge className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold gap-1 shadow-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </Link>

              {/* Course Info */}
              <div className="p-5 space-y-3">
                <Link href={targetUrl} className="group-hover:text-primary transition-colors">
                  <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                </Link>

                <p className="text-xs text-muted-foreground">
                  Instructor: <strong className="text-foreground font-medium">{course.instructor?.name || "IZBA Instructor"}</strong>
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{course.progressPercent}% complete</span>
                    <span>{course.completedChapters}/{course.totalChapters} lessons</span>
                  </div>
                  <Progress value={course.progressPercent} className="h-2 rounded-full" />
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <CardFooter className="p-5 pt-0">
              <Link href={targetUrl} className="w-full">
                <Button
                  size="sm"
                  variant={isFinished ? "outline" : "default"}
                  className="w-full rounded-2xl gap-2 font-bold text-xs shadow-xs"
                >
                  {isFinished ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Review Course
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3.5 w-3.5" />
                      {course.progressPercent > 0 ? "Continue Learning" : "Start Course"}
                    </>
                  )}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
