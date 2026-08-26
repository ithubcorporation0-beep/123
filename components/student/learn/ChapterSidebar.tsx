import Link from "next/link";
import { ProgressBar } from "@/components/student/learn/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";

interface ChapterSidebarProps {
  courseId: string;
  courseTitle: string;
  currentChapterId: string;
  isEnrolled: boolean;
  chapters: {
    id: string;
    title: string;
    position: number;
    isFree: boolean;
    userProgress?: {
      isCompleted: boolean;
    }[];
  }[];
}

export function ChapterSidebar({
  courseId,
  courseTitle,
  currentChapterId,
  isEnrolled,
  chapters,
}: ChapterSidebarProps) {
  const total = chapters.length;
  const completed = chapters.filter(
    (ch) => ch.userProgress?.[0]?.isCompleted
  ).length;

  return (
    <Card className="rounded-3xl border shadow-sm bg-card overflow-hidden sticky top-20">
      <CardHeader className="p-5 pb-4 border-b bg-muted/20 space-y-3">
        <div>
          <h2 className="font-extrabold text-base text-foreground line-clamp-2">
            {courseTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Course Curriculum
          </p>
        </div>

        {isEnrolled && (
          <div className="pt-1">
            <ProgressBar completed={completed} total={total} />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3 space-y-1 max-h-[600px] overflow-y-auto">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === currentChapterId;
          const isCompleted = Boolean(chapter.userProgress?.[0]?.isCompleted);
          const isLocked = !isEnrolled && !chapter.isFree;

          if (isLocked) {
            return (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-3 rounded-2xl opacity-60 text-xs text-muted-foreground bg-muted/10 cursor-not-allowed select-none"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">
                    {index + 1}. {chapter.title}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={chapter.id}
              href={`/student/learn/${courseId}/${chapter.id}`}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all text-xs font-medium ${
                isActive
                  ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-xs"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : isActive ? (
                  <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className="truncate">
                  {index + 1}. {chapter.title}
                </span>
              </div>

              {chapter.isFree && !isEnrolled && (
                <Badge variant="secondary" className="text-[10px] shrink-0 ml-2 font-semibold">
                  Preview
                </Badge>
              )}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
