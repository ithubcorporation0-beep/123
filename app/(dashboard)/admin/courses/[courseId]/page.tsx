import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminCourseEditor } from "@/components/admin/courses/AdminCourseEditor";

interface AdminCourseIdPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function AdminCourseIdPage({ params }: AdminCourseIdPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const { courseId } = await params;

  const [course, categories, instructors] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: true,
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
    }),
    db.courseCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.profile.findMany({
      where: {
        OR: [
          { role: "instructor" },
          { role: "admin" },
        ],
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-serif">
                Edit Course
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
                <Shield className="h-3 w-3 mr-1" /> Admin CMS
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Full control over metadata, instructors, banners, intro videos, SEO, and curriculum.
            </p>
          </div>
        </div>

        <Link href={`/admin/courses/${course.id}/curriculum`}>
          <Button variant="default" size="sm" className="rounded-xl text-xs font-semibold">
            Edit Curriculum ({course._count.modules} modules)
          </Button>
        </Link>
      </div>

      <AdminCourseEditor
        course={course}
        instructors={instructors}
        categories={categories}
      />
    </div>
  );
}
