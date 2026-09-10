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
    const matchesSearch =
      (e.profile.name && e.profile.name.toLowerCase().includes(q)) ||
      e.profile.email.toLowerCase().includes(q) ||
      e.course.title.toLowerCase().includes(q);

    const matchesCourse =
      selectedCourseFilter === "all" || e.course.id === selectedCourseFilter;

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
        const err = await res.json();
        throw new Error(err.error || "Enrollment failed");
      }

      const created = await res.json();
      setEnrollments((prev) => [created, ...prev]);
      setIsEnrollOpen(false);
      toast.success("Student enrolled into course successfully! 🎓");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or course title..."
              className="pl-8 h-8 rounded-xl text-xs bg-background"
            />
          </div>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border bg-background text-xs"
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
          className="rounded-xl text-xs gap-1.5 font-bold shadow-xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Enroll Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Student</TableHead>
              <TableHead className="text-xs font-bold">Enrolled Course</TableHead>
              <TableHead className="text-xs font-bold">Enrollment Date</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
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
              filtered.map((e) => (
                <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                  {/* Student Cell */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                        {e.profile.imageUrl ? (
                          <Image src={e.profile.imageUrl} alt={e.profile.name || "Student"} fill unoptimized className="object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{e.profile.name || "Student"}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{e.profile.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Course Cell */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-7 rounded-lg overflow-hidden border bg-muted shrink-0">
                        {e.course.thumbnail ? (
                          <Image src={e.course.thumbnail} alt={e.course.title} fill unoptimized className="object-cover" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5 text-primary m-auto" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/courses/${e.course.id}`}
                          className="text-xs font-bold text-foreground hover:text-primary truncate block"
                        >
                          {e.course.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground font-mono">/{e.course.slug}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <Badge variant="default" className="text-[10px] uppercase font-bold bg-emerald-600">
                      Active
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-right">
                    <ConfirmModal
                      onConfirm={() => handleCancelEnrollment(e.id)}
                      title="Cancel Enrollment"
                      description={`Remove ${e.profile.name || e.profile.email} from "${e.course.title}"?`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Cancel
                      </Button>
                    </ConfirmModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Manual Enroll Dialog --- */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll Student into Course</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
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
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
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
            <Button variant="outline" onClick={() => setIsEnrollOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleManualEnroll} disabled={loading} className="rounded-xl font-bold">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Enroll Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
