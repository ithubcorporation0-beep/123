import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Layers, Sparkles, PlusCircle } from "lucide-react";

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

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
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
  });

  if (!course) {
    notFound();
  }

  // Verify ownership or admin permission
  if (course.instructorId !== user.id && user.role !== "admin") {
    redirect("/teacher/courses");
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
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
                {course.title}
              </h1>
              <Badge variant={course.isPublished ? "default" : "secondary"} className="uppercase text-[10px] font-bold">
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Slug: /{course.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl font-medium text-xs">
            Preview Course
          </Button>
          <Button size="sm" className="rounded-xl font-medium text-xs gap-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Publish Changes
          </Button>
        </div>
      </div>

      {/* Course Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Details Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Course Details
            </CardTitle>
            <CardDescription>
              Basic metadata and category classification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Title</span>
              <p className="font-medium text-foreground mt-0.5">{course.title}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Category</span>
              <p className="font-medium text-foreground mt-0.5">{course.category?.name || "Unassigned"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Price</span>
              <p className="font-medium text-foreground mt-0.5">{course.price === 0 ? "Free ($0.00)" : `$${course.price.toFixed(2)}`}</p>
            </div>
          </CardContent>
        </Card>

        {/* Modules & Curriculum Summary */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Curriculum Structure
              </CardTitle>
              <CardDescription>
                {course.modules.length} {course.modules.length === 1 ? "module" : "modules"} defined.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs">
              <PlusCircle className="h-3.5 w-3.5" />
              Add Module
            </Button>
          </CardHeader>
          <CardContent>
            {course.modules.length === 0 ? (
              <div className="py-8 text-center border rounded-xl border-dashed text-xs text-muted-foreground">
                No modules yet. Click "Add Module" to start structuring your lessons.
              </div>
            ) : (
              <div className="space-y-2">
                {course.modules.map((m, idx) => (
                  <div key={m.id} className="p-3 rounded-xl border bg-muted/30 flex items-center justify-between text-xs">
                    <span className="font-semibold">{idx + 1}. {m.title}</span>
                    <span className="text-muted-foreground">{m.lessons.length} lessons</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
