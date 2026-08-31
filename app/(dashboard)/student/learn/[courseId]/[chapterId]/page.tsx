import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { findFallbackCourse } from "@/lib/course-catalog";
import { ChapterSidebar } from "@/components/student/learn/ChapterSidebar";
import { VideoPlayer } from "@/components/student/learn/VideoPlayer";
import { MarkCompleteButton } from "@/components/student/learn/MarkCompleteButton";
import { ArrowLeft, Sparkles, User, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentLearnPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function StudentLearnPage({ params }: StudentLearnPageProps) {
  const user = await getCurrentUser();
  const { courseId, chapterId } = await params;

  let course: any = null;
  let enrollment: any = null;

  try {
    course = await db.course.findFirst({
      where: {
        OR: [{ id: courseId }, { slug: courseId }],
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
            muxData: true,
            userProgress: user
              ? {
                  where: {
                    profileId: user.id,
                  },
                }
              : false,
          },
        },
      },
    });

    if (course && user) {
      enrollment = await db.enrollment.findUnique({
        where: {
          profileId_courseId: {
            profileId: user.id,
            courseId: course.id,
          },
        },
      });
    }
  } catch (error) {
    console.warn("[STUDENT_LEARN_PAGE] Error fetching course DB:", error);
  }

  // Fallback to catalog data if DB is unseeded
  if (!course) {
    const fallback = findFallbackCourse(courseId);
    course = {
      id: fallback.id,
      title: fallback.title,
      slug: fallback.slug,
      description: fallback.description,
      instructor: fallback.instructor,
      chapters: fallback.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        description: ch.description,
        position: ch.position,
        isFree: ch.isFree,
        duration: ch.duration,
        videoUrl: ch.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        userProgress: [],
        muxData: null,
      })),
    };
  }

  const currentChapterIndex = Math.max(
    0,
    course.chapters.findIndex((c: any) => c.id === chapterId || c.title.toLowerCase().includes(chapterId.toLowerCase()))
  );
  const currentChapter = course.chapters[currentChapterIndex] || course.chapters[0];

  const isEnrolled = Boolean(enrollment || user);
  const prevChapter = course.chapters[currentChapterIndex - 1];
  const nextChapter = course.chapters[currentChapterIndex + 1];
  const isCompleted = Boolean(currentChapter.userProgress?.[0]?.isCompleted);
  const videoUrl =
    currentChapter.videoUrl ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 px-4 sm:px-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.id || course.slug}`}>
            <Button variant="ghost" size="icon" className="rounded-2xl border border-border/60 hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {course.title}
              </h1>
              {currentChapter.isFree && (
                <Badge variant="secondary" className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5">
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
          {!user ? (
            <Link href="/login">
              <Button size="sm" className="rounded-xl text-xs gap-1.5 font-bold shadow-md">
                <User className="h-3.5 w-3.5" />
                Sign in to Track Progress
              </Button>
            </Link>
          ) : (
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 rounded-full border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              Active Student
            </Badge>
          )}
        </div>
      </div>

      {/* Main Learning Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Curriculum & Progress Sidebar */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ChapterSidebar
            courseId={course.id}
            courseTitle={course.title}
            currentChapterId={currentChapter.id}
            isEnrolled={true}
            chapters={course.chapters}
          />
        </div>

        {/* Right: Main Video Player & Lesson Notes */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            playbackId={currentChapter.muxData?.playbackId}
            videoUrl={videoUrl}
            title={currentChapter.title}
            courseId={course.id}
            chapterId={currentChapter.id}
            nextChapterId={nextChapter?.id}
            isCompleted={isCompleted}
          />

          {/* Title & Controls */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {currentChapter.title}
              </h2>
            </div>

            {/* Navigation & Mark Complete Controls */}
            <MarkCompleteButton
              courseId={course.id}
              courseTitle={course.title}
              chapterId={currentChapter.id}
              isCompleted={isCompleted}
              nextChapterId={nextChapter?.id}
              prevChapterId={prevChapter?.id}
              isFinalChapter={!nextChapter}
            />

            {/* Chapter Lesson Notes */}
            {currentChapter.description && (
              <div className="p-7 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-sm space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-primary" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground">
                    Lesson Curriculum Notes & Guide
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pt-1">
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
