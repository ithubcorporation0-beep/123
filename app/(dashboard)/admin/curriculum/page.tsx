import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminCurriculumManager, ModuleItem } from "@/components/admin/curriculum/AdminCurriculumManager";
import { BookOpen, Layers, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminCurriculumPageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function AdminCurriculumPage({ searchParams }: AdminCurriculumPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const { courseId } = await searchParams;

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { modules: true } },
    },
  });

  const selectedCourseId = courseId || courses[0]?.id;

  let selectedCourseWithModules = null;
  if (selectedCourseId) {
    selectedCourseWithModules = await db.course.findUnique({
      where: { id: selectedCourseId },
      include: {
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
  }

  const formattedModules: ModuleItem[] =
    selectedCourseWithModules?.modules.map((m) => ({
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
    })) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
              Modules & Lessons Management
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
              Curriculum CMS
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Build, edit, and organize complete course syllabus hierarchies with videos, documents, and interactive lessons.
          </p>
        </div>

        <Link href="/admin/courses/create">
          <Button size="sm" className="rounded-2xl text-xs gap-1.5 font-bold shadow-xs">
            <Plus className="h-3.5 w-3.5" />
            New Course
          </Button>
        </Link>
      </div>

      {/* Course Selector Tabs/Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Select Course to Edit Curriculum:
        </label>
        {courses.length === 0 ? (
          <Card className="rounded-2xl border p-6 text-center text-sm text-muted-foreground">
            No courses found. Please create a course first.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {courses.map((c) => {
              const isSelected = c.id === selectedCourseId;
              return (
                <Link key={c.id} href={`/admin/curriculum?courseId=${c.id}`}>
                  <Card
                    className={`rounded-2xl border transition-all cursor-pointer h-full ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                        : "bg-card hover:bg-muted/30"
                    }`}
                  >
                    <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                      <div>
                        <Badge
                          variant={c.isPublished ? "default" : "secondary"}
                          className="text-[9px] uppercase font-bold px-1.5 py-0 mb-1.5"
                        >
                          {c.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <h3 className="text-xs font-bold text-foreground line-clamp-2">
                          {c.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
                        <span>{c._count.modules} modules</span>
                        <span className="text-primary font-semibold">
                          {isSelected ? "Editing" : "Select"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Course Curriculum Manager */}
      {selectedCourseWithModules && (
        <div className="pt-4 border-t">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-extrabold text-foreground">
                Curriculum for: {selectedCourseWithModules.title}
              </h2>
            </div>
            <Link href={`/admin/courses/${selectedCourseWithModules.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                Edit Course Info
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <AdminCurriculumManager
            courseId={selectedCourseWithModules.id}
            courseTitle={selectedCourseWithModules.title}
            initialModules={formattedModules}
          />
        </div>
      )}
    </div>
  );
}
