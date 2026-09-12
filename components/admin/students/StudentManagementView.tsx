"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  BookOpen,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  Mail,
  GraduationCap,
  Award,
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

export interface StudentRecord {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: Date | string;
  enrollments: {
    id: string;
    course: { id: string; title: string; slug: string; thumbnail?: string | null };
  }[];
  certificates: { id: string; course: { title: string } }[];
  _count: { enrollments: number; certificates: number };
}

interface StudentManagementViewProps {
  initialStudents: StudentRecord[];
}

export function StudentManagementView({ initialStudents }: StudentManagementViewProps) {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Add Student Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Edit / View Student Modal
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(q)) ||
      s.email.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateStudent = async () => {
    if (!newEmail.trim()) {
      toast.error("Student email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create student");
      }

      const created = await res.json();
      setStudents((prev) => [
        { ...created, enrollments: [], certificates: [], _count: { enrollments: 0, certificates: 0 } },
        ...prev,
      ]);
      setIsAddOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      toast.success("Student account registered!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          status: editStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update student");
      }

      const updated = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
      );
      setSelectedStudent(null);
      toast.success("Student updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete student");

      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student account deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  const handleRemoveEnrollment = async (studentId: string, enrollmentId: string) => {
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove enrollment");

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                enrollments: s.enrollments.filter((e) => e.id !== enrollmentId),
                _count: { ...s._count, enrollments: s._count.enrollments - 1 },
              }
            : s
        )
      );

      if (selectedStudent) {
        setSelectedStudent({
          ...selectedStudent,
          enrollments: selectedStudent.enrollments.filter((e) => e.id !== enrollmentId),
        });
      }

      toast.success("Enrollment removed");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove enrollment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-card border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or email..."
              className="pl-8 h-8 rounded-[10px] text-xs bg-background border-border"
            />
          </div>

          <div className="flex items-center gap-1">
            {["all", "ACTIVE", "SUSPENDED"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="rounded-[10px] text-xs capitalize h-8"
              >
                {st === "all" ? "All Status" : st.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="rounded-[10px] text-xs gap-1.5 font-bold shadow-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.4)]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Student</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Contact</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Courses Enrolled</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Joined</TableHead>
              <TableHead className="text-xs font-bold text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No students found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((s) => {
                const hasValidAvatar = Boolean(
                  s.imageUrl &&
                  typeof s.imageUrl === "string" &&
                  s.imageUrl.startsWith("http")
                );

                const dateString = s.createdAt
                  ? new Date(s.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                const enrollmentsList = s.enrollments || [];

                return (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-[10px] overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                          {hasValidAvatar ? (
                            <Image src={s.imageUrl!} alt={s.name || "Student"} fill unoptimized className="object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{s.name || "Unnamed Student"}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {s.phone ? (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="h-3 w-3" /> {s.phone}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/60">—</span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-xs font-semibold gap-1 rounded-[10px]">
                        <BookOpen className="h-3 w-3 text-primary" />
                        {enrollmentsList.length} {enrollmentsList.length === 1 ? "course" : "courses"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge
                        variant={s.status === "ACTIVE" ? "default" : "destructive"}
                        className="text-[10px] uppercase font-bold rounded-[10px]"
                      >
                        {s.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {dateString}
                    </TableCell>

                    <TableCell className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(s);
                            setEditName(s.name || "");
                            setEditEmail(s.email);
                            setEditPhone(s.phone || "");
                            setEditStatus(s.status);
                          }}
                          className="h-8 text-xs rounded-[10px] px-2.5"
                        >
                          Manage
                        </Button>

                        <ConfirmModal
                          onConfirm={() => handleDeleteStudent(s.id)}
                          title="Delete Student"
                          description={`Are you sure you want to permanently delete student account ${s.email}?`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmModal>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Add Student Dialog --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-[10px] max-w-md">
          <DialogHeader>
            <DialogTitle>Register New Student</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Full Name</label>
              <Input
                placeholder="Student Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Email Address *</label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-[10px] text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phone Number (optional)</label>
              <Input
                placeholder="+1 555-0199"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleCreateStudent} disabled={loading} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Create Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Manage Student Dialog --- */}
      <Dialog open={Boolean(selectedStudent)} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="rounded-[10px] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Student: {selectedStudent?.name || selectedStudent?.email}</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-5 py-2">
              {/* Profile Details Edit */}
              <div className="space-y-3 p-4 rounded-[10px] border bg-muted/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Account Details
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Full Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-[10px] text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Email</label>
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="rounded-[10px] text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Phone</label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="rounded-[10px] text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-[10px] border bg-background text-xs font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE (Can login and learn)</option>
                    <option value="SUSPENDED">SUSPENDED (Access blocked)</option>
                  </select>
                </div>
              </div>

              {/* Enrolled Courses & Remove Enrollment */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Enrolled Courses ({selectedStudent.enrollments?.length || 0})
                </h4>

                {!selectedStudent.enrollments || selectedStudent.enrollments.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 border rounded-[10px] bg-card">
                    Student is not currently enrolled in any course.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedStudent.enrollments.map((enr) => (
                      <div
                        key={enr.id}
                        className="p-3 rounded-[10px] border bg-card flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{enr.course?.title || "Course"}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">/{enr.course?.slug || "course"}</p>
                        </div>
                        <ConfirmModal
                          onConfirm={() => handleRemoveEnrollment(selectedStudent.id, enr.id)}
                          title="Cancel Student Enrollment"
                          description={`Remove ${selectedStudent.name || selectedStudent.email} from "${enr.course?.title || "Course"}"?`}
                        >
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive rounded-[10px]">
                            Remove
                          </Button>
                        </ConfirmModal>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleUpdateStudent} disabled={loading} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
