"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Presentation, Edit3, ChevronRight } from "lucide-react";

interface CourseWithRelations {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  price: number;
  createdAt: Date;
  category: {
    name: string;
  } | null;
  modules: {
    id: string;
    lessons: {
      id: string;
    }[];
  }[];
  enrollments: {
    id: string;
  }[];
}

interface CourseListProps {
  courses: CourseWithRelations[];
}

export function CourseList({ courses }: CourseListProps) {
  const router = useRouter();

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={Presentation}
        title="No courses created yet"
        description="You haven't created any courses. Start by creating a course, adding modules, video lectures, and quizzes."
        actionLabel="Create Your First Course"
        actionHref="/teacher/courses/create"
      />
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[40%] font-semibold">Course Title</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Curriculum</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => {
            const moduleCount = course.modules.length;
            const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

            return (
              <TableRow
                key={course.id}
                onClick={() => router.push(`/teacher/courses/${course.id}`)}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-bold text-foreground">
                  <div className="flex flex-col">
                    <span className="text-base">{course.title}</span>
                    <span className="text-xs font-mono text-muted-foreground mt-0.5">
                      /{course.slug}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {course.category?.name || "Uncategorized"}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={course.isPublished ? "default" : "secondary"}
                    className="text-[10px] uppercase font-bold tracking-wider"
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{moduleCount}</span> {moduleCount === 1 ? "module" : "modules"}
                    <span className="mx-1.5">•</span>
                    <span className="font-semibold text-foreground">{lessonCount}</span> {lessonCount === 1 ? "lesson" : "lessons"}
                  </div>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {new Date(course.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/teacher/courses/${course.id}`);
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
