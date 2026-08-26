import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, Video, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChapterTitleForm } from "@/components/teacher/chapters/ChapterTitleForm";
import { ChapterDescriptionForm } from "@/components/teacher/chapters/ChapterDescriptionForm";
import { ChapterAccessForm } from "@/components/teacher/chapters/ChapterAccessForm";
import { VideoUpload } from "@/components/teacher/courses/VideoUpload";
import { ChapterActions } from "@/components/teacher/chapters/ChapterActions";

interface ChapterIdPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { courseId, chapterId } = await params;

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
      course: true,
    },
  });

  if (!chapter) {
    notFound();
  }

  // Authorization check: User must own the course or be an admin
  if (chapter.course.instructorId !== user.id && user.role !== "admin") {
    redirect("/teacher/courses");
  }

  const missingFields: string[] = [];
  if (!chapter.title) missingFields.push("Title");
  if (!chapter.description) missingFields.push("Description");
  if (!chapter.videoUrl && !chapter.muxData?.playbackId) missingFields.push("Video Lecture");

  const totalFields = 3;
  const completedFields = totalFields - missingFields.length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = missingFields.length === 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner if Unpublished */}
      {!chapter.isPublished && (
        <div className="flex items-center gap-x-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            This chapter is not visible in the course. Complete all required fields to publish.
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/teacher/courses/${courseId}`}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Chapter Setup
              </h1>
              <Badge
                variant={chapter.isPublished ? "default" : "secondary"}
                className="uppercase text-[10px] font-bold"
              >
                {chapter.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Complete all fields to publish {completionText}
            </p>
          </div>
        </div>

        <ChapterActions
          disabled={!isComplete}
          courseId={courseId}
          chapterId={chapterId}
          isPublished={chapter.isPublished}
          missingFields={missingFields}
        />
      </div>

      {/* Grid of Chapter Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Basic Details & Access */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Customize your chapter
            </h2>
          </div>

          <ChapterTitleForm
            initialData={{ title: chapter.title }}
            courseId={courseId}
            chapterId={chapterId}
          />

          <ChapterDescriptionForm
            initialData={{ description: chapter.description }}
            courseId={courseId}
            chapterId={chapterId}
          />

          <div className="flex items-center gap-x-2 pt-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Access Settings
            </h2>
          </div>

          <ChapterAccessForm
            initialData={{ isFree: chapter.isFree }}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>

        {/* Right Column: Video Upload & Stream Player */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Video className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Chapter Video
            </h2>
          </div>

          <VideoUpload
            initialData={{
              videoUrl: chapter.videoUrl,
              muxData: chapter.muxData,
            }}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
      </div>
    </div>
  );
}
