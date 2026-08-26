import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PlayCircle, Sparkles, ArrowRight } from "lucide-react";

interface ContinueLearningCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category?: { name: string } | null;
  instructor?: { name: string | null } | null;
  nextChapterId: string;
  nextChapterTitle?: string;
  completedChaptersCount: number;
  totalChaptersCount: number;
  progressPercent: number;
}

interface ContinueLearningProps {
  course: ContinueLearningCourse | null;
}

export function ContinueLearning({ course }: ContinueLearningProps) {
  if (!course) {
    return (
      <Card className="rounded-3xl border border-dashed bg-card/40 p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">No courses in progress</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
            Enroll in a course from our catalog to start tracking your learning progress and earning certificates.
          </p>
        </div>
        <Link href="/courses" className="inline-block">
          <Button size="sm" className="rounded-xl gap-2 text-xs font-bold shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Browse Courses
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border bg-gradient-to-br from-card via-card to-primary/5 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
        {/* Left: Thumbnail */}
        <div className="md:col-span-4 relative aspect-video rounded-2xl overflow-hidden bg-muted/40 border shadow-xs">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
          )}
          {course.category && (
            <Badge className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold" variant="outline">
              {course.category.name}
            </Badge>
          )}
        </div>

        {/* Right: Info & Resume Action */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <Badge variant="secondary" className="gap-1 text-[10px] font-bold text-primary mb-1">
              <PlayCircle className="h-3 w-3" />
              Continue Learning
            </Badge>
            <h3 className="text-xl font-extrabold text-foreground leading-snug line-clamp-1">
              {course.title}
            </h3>
            {course.nextChapterTitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                Next lesson: <strong className="text-foreground font-medium">{course.nextChapterTitle}</strong>
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>{course.progressPercent}% Completed</span>
              <span>{course.completedChaptersCount} of {course.totalChaptersCount} lessons</span>
            </div>
            <Progress value={course.progressPercent} className="h-2 rounded-full" />
          </div>

          {/* CTA Action */}
          <div className="pt-2">
            <Link href={`/student/learn/${course.id}/${course.nextChapterId}`}>
              <Button className="rounded-xl gap-2 font-bold text-xs shadow-sm">
                <PlayCircle className="h-4 w-4" />
                Resume Lesson
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
