"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";

export interface AdminCourseRecord {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  categoryName: string;
  instructorName: string;
  instructorAvatar?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  enrolledStudentsCount: number;
  chaptersCount: number;
  createdAt: Date | string;
}

interface AdminCourseTableProps {
  courses: AdminCourseRecord[];
}

export function AdminCourseTable({ courses }: AdminCourseTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.instructorName.toLowerCase().includes(q) ||
      c.categoryName.toLowerCase().includes(q)
    );
  });

  const onToggleFeatured = async (course: AdminCourseRecord) => {
    try {
      setLoadingId(course.id);
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !course.isFeatured }),
      });

      if (!res.ok) {
        throw new Error("Failed to update featured state");
      }

      toast.success(
        course.isFeatured ? "Removed from Featured" : "Promoted to Featured on Homepage! ✨"
      );
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const onTogglePublished = async (course: AdminCourseRecord) => {
    try {
      setLoadingId(course.id);
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to update publication state");
      }

      toast.success(course.isPublished ? "Course unpublished" : "Course published live");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      setLoadingId(courseId);
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      toast.success("Course deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by course title or instructor..."
          className="pl-10 pr-9 rounded-2xl h-10 text-xs bg-card border shadow-xs transition-all focus:ring-2 focus:ring-primary/20"
        />
        {searchTerm && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Courses Table */}
      <div className="rounded-3xl border border-border/70 overflow-hidden shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Course</TableHead>
              <TableHead className="text-xs font-bold">Instructor</TableHead>
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">Students</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Moderation Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => {
              const isLoading = loadingId === course.id;

              return (
                <TableRow key={course.id} className="hover:bg-muted/30 transition-all duration-200">
                  {/* Course Name & Thumbnail */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-8 rounded-xl overflow-hidden border bg-muted shrink-0">
                        {course.thumbnail ? (
                          <Image src={course.thumbnail} alt={course.title} fill unoptimized className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            <BookOpen className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {course.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">
                            {course.chaptersCount} chapters
                          </span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <Link
                            href={`/courses/${course.id}`}
                            target="_blank"
                            className="text-[11px] text-primary/80 hover:text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            Preview
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Instructor */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                        {course.instructorName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-4">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {course.categoryName}
                    </Badge>
                  </TableCell>

                  {/* Students */}
                  <TableCell className="py-4 text-xs font-bold">
                    {course.enrolledStudentsCount}
                  </TableCell>

                  {/* Badges */}
                  <TableCell className="py-4 space-y-1">
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                      className="text-[10px] uppercase font-bold block w-fit"
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {course.isFeatured && (
                      <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[9px] font-bold block w-fit gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-white" /> Featured
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Curriculum Button */}
                      <Link href={`/admin/courses/${course.id}/curriculum`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs h-8 px-2.5 gap-1 border-border text-foreground hover:bg-muted transition-colors"
                          title="Manage Modules & Lessons"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          <span className="hidden sm:inline">Curriculum</span>
                        </Button>
                      </Link>

                      {/* Edit Course Button */}
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs h-8 px-2.5 gap-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="Edit Course Details & Pictures"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                      </Link>

                      {/* Featured Toggle */}
                      <Button
                        onClick={() => onToggleFeatured(course)}
                        disabled={isLoading}
                        variant={course.isFeatured ? "default" : "outline"}
                        size="sm"
                        className="rounded-xl text-xs h-8 px-2.5 gap-1"
                        title={course.isFeatured ? "Remove from Featured" : "Feature Course on Home Page"}
                      >
                        <Star className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline-block">
                          {course.isFeatured ? "Featured" : "Feature"}
                        </span>
                      </Button>

                      {/* Publish / Force Unpublish Toggle */}
                      <Button
                        onClick={() => onTogglePublished(course)}
                        disabled={isLoading}
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs h-8 px-2"
                        title={course.isPublished ? "Force Unpublish" : "Publish Course"}
                      >
                        {course.isPublished ? (
                          <EyeOff className="h-4 w-4 text-amber-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-emerald-600" />
                        )}
                      </Button>

                      {/* Delete Modal */}
                      <ConfirmModal
                        title="Delete Course Globally?"
                        description={`Are you sure you want to permanently delete "${course.title}"? This cannot be undone.`}
                        confirmText="Delete Course"
                        onConfirm={() => onDeleteCourse(course.id)}
                        disabled={isLoading}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-xl text-xs h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmModal>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
