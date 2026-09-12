"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Trash2,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

export interface EnrollmentRecord {
  id: string;
  createdAt: Date | string;
  profile: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  };
}

interface EnrollmentManagementViewProps {
  initialEnrollments: EnrollmentRecord[];
  allCourses: { id: string; title: string }[];
  allStudents: { id: string; name: string | null; email: string }[];
}

export function EnrollmentManagementView({
  initialEnrollments,
  allCourses,
  allStudents,
}: EnrollmentManagementViewProps) {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(initialEnrollments);
  const [search, setSearch] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Manual Enroll Dialog
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(allStudents[0]?.id || "");
  const [selectedCourseId, setSelectedCourseId] = useState(allCourses[0]?.id || "");

  const filtered = enrollments.filter((e) => {
    const q = search.toLowerCase();
    const studentName = e.profile?.name || "";
    const studentEmail = e.profile?.email || "";
    const courseTitle = e.course?.title || "";

    const matchesSearch =
      studentName.toLowerCase().includes(q) ||
      studentEmail.toLowerCase().includes(q) ||
      courseTitle.toLowerCase().includes(q);

    const matchesCourse =
      selectedCourseFilter === "all" || e.course?.id === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const handleManualEnroll = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Please select both a student and a course");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedStudentId,
          courseId: selectedCourseId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Enrollment failed");
      }

      const created = await res.json();
      setEnrollments((prev) => [created, ...prev]);
      setIsEnrollOpen(false);
      toast.success("Student enrolled into course successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel enrollment");

      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enrollment removed successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel enrollment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-card border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or course title..."
              className="pl-8 h-9 rounded-[10px] text-xs bg-background border-border"
            />
          </div>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-9 px-3 rounded-[10px] border border-border bg-background text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Courses ({allCourses.length})</option>
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={() => setIsEnrollOpen(true)}
          size="sm"
          className="rounded-[10px] text-xs gap-1.5 font-bold shadow-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.4)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Enroll Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Student</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Enrolled Course</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Enrollment Date</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                  No enrollments match current search or filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((e) => {
                const hasValidProfileImg = Boolean(
                  e.profile?.imageUrl &&
                  typeof e.profile.imageUrl === "string" &&
                  e.profile.imageUrl.startsWith("http")
                );

                const hasValidCourseThumb = Boolean(
                  e.course?.thumbnail &&
                  typeof e.course.thumbnail === "string" &&
                  e.course.thumbnail.startsWith("http")
                );

                const dateString = e.createdAt
                  ? new Date(e.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                    {/* Student Cell */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-[10px] overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                          {hasValidProfileImg ? (
                            <Image src={e.profile.imageUrl!} alt={e.profile.name || "Student"} fill unoptimized className="object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{e.profile?.name || "Student"}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{e.profile?.email || "No email"}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Course Cell */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-7 rounded-[10px] overflow-hidden border bg-muted shrink-0">
                          {hasValidCourseThumb ? (
                            <Image src={e.course.thumbnail!} alt={e.course.title || "Course"} fill unoptimized className="object-cover" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5 text-primary m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/courses/${e.course?.id || ""}`}
                            className="text-xs font-bold text-foreground hover:text-primary truncate block"
                          >
                            {e.course?.title || "Course"}
                          </Link>
                          <span className="text-[10px] text-muted-foreground font-mono">/{e.course?.slug || "course"}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {dateString}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      <Badge variant="default" className="text-[10px] uppercase font-bold bg-emerald-600 rounded-[10px]">
                        Active
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3.5 text-right">
                      <ConfirmModal
                        onConfirm={() => handleCancelEnrollment(e.id)}
                        title="Cancel Enrollment"
                        description={`Remove ${e.profile?.name || e.profile?.email || "Student"} from "${e.course?.title || "Course"}"?`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-[10px]"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </Button>
                      </ConfirmModal>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Manual Enroll Dialog --- */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="rounded-[10px] max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll Student into Course</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] border border-border bg-background text-sm"
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.email} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] border border-border bg-background text-sm"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnrollOpen(false)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleManualEnroll} disabled={loading} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Enroll Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
