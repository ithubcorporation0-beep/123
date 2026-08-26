import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TitleForm } from "@/components/teacher/courses/edit/TitleForm";
import { DescriptionForm } from "@/components/teacher/courses/edit/DescriptionForm";
import { CategoryForm } from "@/components/teacher/courses/edit/CategoryForm";
import { LevelForm } from "@/components/teacher/courses/edit/LevelForm";
import { ImageUpload } from "@/components/teacher/courses/ImageUpload";
import { ChaptersPlaceholderForm } from "@/components/teacher/courses/edit/ChaptersPlaceholderForm";
import { CourseActions } from "@/components/teacher/courses/edit/CourseActions";

interface CourseIdPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { courseId } = await params;

  const [course, categories] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    }),
    db.courseCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!course) {
    notFound();
  }

  // Authorization check: User must own the course or be an admin
  if (course.instructorId !== user.id && user.role !== "admin") {
    redirect("/teacher/courses");
  }

  // Calculate completion requirements (6 total fields):
  // 1. Title
  // 2. Description
  // 3. Image (thumbnail)
  // 4. Category (categoryId)
  // 5. Level
  // 6. At least one module with lessons (published chapter)
  const hasPublishedChapter = course.modules.some((m) => m.lessons.length > 0) || course.modules.length > 0;

  const requiredFields = [
    Boolean(course.title),
    Boolean(course.description),
    Boolean(course.thumbnail),
    Boolean(course.categoryId),
    Boolean(course.level),
    hasPublishedChapter,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner if Unpublished */}
      {!course.isPublished && (
        <div className="flex items-center gap-x-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            This course is currently in <strong>Draft</strong>. Complete all required fields to publish.
          </span>
        </div>
      )}

      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/teacher/courses">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Course Setup
              </h1>
              <Badge
                variant={course.isPublished ? "default" : "secondary"}
                className="uppercase text-[10px] font-bold"
              >
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Complete all fields to publish {completionText}
            </p>
          </div>
        </div>

        <CourseActions
          disabled={!isComplete}
          courseId={course.id}
          isPublished={course.isPublished}
        />
      </div>

      {/* Grid of Course Setup Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Customize your course
            </h2>
          </div>

          <TitleForm
            initialData={{ title: course.title }}
            courseId={course.id}
          />

          <DescriptionForm
            initialData={{ description: course.description }}
            courseId={course.id}
          />

          <ImageUpload
            initialData={{ thumbnail: course.thumbnail }}
            courseId={course.id}
          />

          <CategoryForm
            initialData={{ categoryId: course.categoryId }}
            courseId={course.id}
            options={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />

          <LevelForm
            initialData={{ level: course.level }}
            courseId={course.id}
          />
        </div>

        {/* Right Column: Chapters & Curriculum */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Curriculum & Media
            </h2>
          </div>

          <ChaptersPlaceholderForm
            initialData={{ modules: course.modules }}
          />
        </div>
      </div>
    </div>
  );
}
