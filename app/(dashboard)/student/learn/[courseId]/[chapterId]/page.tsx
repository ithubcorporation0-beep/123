import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChapterSidebar } from "@/components/student/learn/ChapterSidebar";
import { VideoPlayer } from "@/components/student/learn/VideoPlayer";
import { MarkCompleteButton } from "@/components/student/learn/MarkCompleteButton";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const currentChapterIndex = course.chapters.findIndex((c) => c.id === chapterId);
  const currentChapter = course.chapters[currentChapterIndex];

  if (!currentChapter) {
    notFound();
  }

  // Access rule: user must be enrolled OR chapter isFree (preview)
  const isEnrolled = Boolean(enrollment);
  if (!isEnrolled && !currentChapter.isFree) {
    redirect(`/courses/${course.id}`);
  }

  const prevChapter = course.chapters[currentChapterIndex - 1];
  const nextChapter = course.chapters[currentChapterIndex + 1];

  const playbackId = currentChapter.muxData?.playbackId;
  const isCompleted = Boolean(currentChapter.userProgress?.[0]?.isCompleted);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/my-courses">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {course.title}
              </h1>
              {currentChapter.isFree && !isEnrolled && (
                <Badge variant="secondary" className="text-xs font-semibold text-primary">
                  Free Preview
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chapter {currentChapterIndex + 1} of {course.chapters.length}:{" "}
              <strong className="text-foreground font-semibold">{currentChapter.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEnrolled ? (
            <Link href={`/courses/${course.id}`}>
              <Button size="sm" className="rounded-xl text-xs gap-1.5 font-bold shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Enroll in Full Course
              </Button>
            </Link>
          ) : (
            <Badge variant="outline" className="text-xs font-semibold">
              Enrolled Student
            </Badge>
          )}
        </div>
      </div>

      {/* Main Learning Layout: Sidebar on Left, Main Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Curriculum & Progress Sidebar */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ChapterSidebar
            courseId={course.id}
            courseTitle={course.title}
            currentChapterId={currentChapter.id}
            isEnrolled={isEnrolled}
            chapters={course.chapters}
          />
        </div>

        {/* Right: Main Video Player & Lesson Notes */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            playbackId={playbackId}
            videoUrl={currentChapter.videoUrl}
            title={currentChapter.title}
            courseId={course.id}
            chapterId={currentChapter.id}
            nextChapterId={nextChapter?.id}
            isCompleted={isCompleted}
          />

          {/* Title & Mark Complete Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-foreground">
                {currentChapter.title}
              </h2>
            </div>

            {/* Navigation & Mark Complete Controls */}
            {isEnrolled && (
              <MarkCompleteButton
                courseId={course.id}
                chapterId={currentChapter.id}
                isCompleted={isCompleted}
                nextChapterId={nextChapter?.id}
                prevChapterId={prevChapter?.id}
              />
            )}

            {/* Chapter Lesson Notes */}
            {currentChapter.description && (
              <div className="p-6 rounded-3xl border bg-card/60 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Lesson Notes & Instructions
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {currentChapter.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
