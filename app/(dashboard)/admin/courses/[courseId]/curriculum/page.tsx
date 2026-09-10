import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminCurriculumManager, ModuleItem } from "@/components/admin/curriculum/AdminCurriculumManager";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseCurriculumPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseCurriculumPage({ params }: CourseCurriculumPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      category: true,
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: { resources: true },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const formattedModules: ModuleItem[] = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    position: m.position,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      position: l.position,
      isFree: l.isFree,
      isPublished: l.isPublished,
      contentType: l.contentType,
      videoUrl: l.videoUrl,
      videoThumbnail: l.videoThumbnail,
      duration: l.duration,
      externalUrl: l.externalUrl,
      content: l.content,
      resources: l.resources.map((r) => ({
        id: r.id,
        title: r.title,
        fileUrl: r.fileUrl,
      })),
    })),
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/admin/courses/${courseId}`}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Manage Curriculum
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                {course.title}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add modules, videos, notes, resources, and organize lesson sequences.
            </p>
          </div>
        </div>

        <Link href={`/admin/courses/${courseId}`}>
          <Button variant="outline" size="sm" className="rounded-xl text-xs">
            Back to Course Details
          </Button>
        </Link>
      </div>

      <AdminCurriculumManager
        courseId={course.id}
        courseTitle={course.title}
        initialModules={formattedModules}
      />
    </div>
  );
}
