import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeft, CheckCircle2, Circle, Lock, PlayCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StudentLearnPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function StudentLearnPage({ params }: StudentLearnPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { courseId, chapterId } = await params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
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
  });

  if (!course) {
    notFound();
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      profileId_courseId: {
        profileId: user.id,
        courseId: course.id,
      },
    },
  });

  const currentChapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: course.id,
      isPublished: true,
    },
    include: {
      muxData: true,
      userProgress: {
        where: {
          profileId: user.id,
        },
      },
    },
  });

  if (!currentChapter) {
    notFound();
  }

  // Allow free preview even if not enrolled, but redirect if locked
  if (!enrollment && !currentChapter.isFree) {
    redirect(`/courses/${course.id}`);
  }

  const playbackId = currentChapter.muxData?.playbackId;
  const isCompleted = Boolean(currentChapter.userProgress[0]?.isCompleted);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/my-courses">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chapter: <strong className="text-foreground">{currentChapter.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {enrollment ? (
            <Badge variant="secondary" className="font-semibold text-xs">
              Enrolled Student
            </Badge>
          ) : (
            <Badge variant="outline" className="font-semibold text-xs text-primary">
              Free Preview Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Chapters on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Video Player & Chapter Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border shadow-sm relative flex items-center justify-center">
            {playbackId ? (
              <MuxPlayer
                playbackId={playbackId}
                metadata={{
                  video_title: currentChapter.title,
                }}
                className="w-full h-full"
                autoPlay={false}
              />
            ) : currentChapter.videoUrl ? (
              <video
                src={currentChapter.videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <Video className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm font-semibold">No video stream available for this chapter</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {currentChapter.title}
              </h2>
            </div>

            {currentChapter.description && (
              <div className="p-5 rounded-2xl border bg-card/60 text-sm text-muted-foreground leading-relaxed">
                <p className="font-semibold text-xs uppercase tracking-wider text-foreground mb-2">
                  Lesson Notes
                </p>
                {currentChapter.description}
              </div>
            )}
          </div>
        </div>

        {/* Right Chapters Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-2xl border shadow-sm overflow-hidden bg-card">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Course Curriculum</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {course.chapters.length} published chapters
              </p>
            </div>

            <CardContent className="p-2 space-y-1 max-h-[500px] overflow-y-auto">
              {course.chapters.map((ch, index) => {
                const isActive = ch.id === currentChapter.id;
                const isChapterCompleted = Boolean(ch.userProgress[0]?.isCompleted);
                const isLocked = !enrollment && !ch.isFree;

                return isLocked ? (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between p-3 rounded-xl opacity-60 text-xs text-muted-foreground cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {index + 1}. {ch.title}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={ch.id}
                    href={`/student/learn/${course.id}/${ch.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors text-xs font-medium ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isChapterCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">
                        {index + 1}. {ch.title}
                      </span>
                    </div>

                    {ch.isFree && !enrollment && (
                      <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">
                        Preview
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
