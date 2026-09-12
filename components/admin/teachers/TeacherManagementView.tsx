"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  BookOpen,
  User,
  Upload,
  Loader2,
  Phone,
  Mail,
  Presentation,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export interface TeacherRecord {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: Date | string;
  coursesCreated: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    price: number;
  }[];
  _count: { coursesCreated: number };
}

interface TeacherManagementViewProps {
  initialTeachers: TeacherRecord[];
}

export function TeacherManagementView({ initialTeachers }: TeacherManagementViewProps) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Add Teacher Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newAvatar, setNewAvatar] = useState("");

  // Edit Teacher Modal
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");

  const filteredTeachers = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      t.email.toLowerCase().includes(q)
    );
  });

  const handleAvatarUpload = async (file: File, isEdit: boolean) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (isEdit) {
        setEditAvatar(data.url);
      } else {
        setNewAvatar(data.url);
      }
      toast.success("Profile picture uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTeacher = async () => {
    if (!newEmail.trim()) {
      toast.error("Teacher email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          bio: newBio,
          imageUrl: newAvatar || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create teacher");
      }

      const created = await res.json();
      setTeachers((prev) => [
        { ...created, coursesCreated: [], _count: { coursesCreated: 0 } },
        ...prev,
      ]);
      setIsAddOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewBio("");
      setNewAvatar("");
      toast.success("Teacher account created successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/teachers/${selectedTeacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          bio: editBio,
          imageUrl: editAvatar || null,
          status: editStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update teacher");
      }

      const updated = await res.json();
      setTeachers((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      );
      setSelectedTeacher(null);
      toast.success("Teacher details saved!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateTeacher = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to suspend teacher");

      setTeachers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "SUSPENDED" } : t))
      );
      toast.success("Teacher suspended");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to suspend teacher");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-card border border-border shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructors by name or email..."
            className="pl-8 h-8 rounded-[10px] text-xs bg-background border-border"
          />
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="rounded-[10px] text-xs gap-1.5 font-bold shadow-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.4)]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Teacher
        </Button>
      </div>

      {/* Teachers Table */}
      <div className="rounded-[10px] border border-border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Teacher</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Contact</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Courses Created</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Joined</TableHead>
              <TableHead className="text-xs font-bold text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No teachers found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((t) => {
                const hasValidAvatar = Boolean(
                  t.imageUrl &&
                  typeof t.imageUrl === "string" &&
                  t.imageUrl.startsWith("http")
                );

                const dateString = t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                const coursesList = t.coursesCreated || [];

                return (
                  <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-[10px] overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                          {hasValidAvatar ? (
                            <Image src={t.imageUrl!} alt={t.name || "Teacher"} fill unoptimized className="object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{t.name || "Instructor"}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{t.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {t.phone ? (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="h-3 w-3" /> {t.phone}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/60">—</span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-xs font-semibold gap-1 rounded-[10px]">
                        <BookOpen className="h-3 w-3 text-primary" />
                        {coursesList.length} {coursesList.length === 1 ? "course" : "courses"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge
                        variant={t.status === "ACTIVE" ? "default" : "destructive"}
                        className="text-[10px] uppercase font-bold rounded-[10px]"
                      >
                        {t.status}
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
                            setSelectedTeacher(t);
                            setEditName(t.name || "");
                            setEditEmail(t.email);
                            setEditPhone(t.phone || "");
                            setEditBio(t.bio || "");
                            setEditAvatar(t.imageUrl || "");
                            setEditStatus(t.status);
                          }}
                          className="h-8 text-xs rounded-[10px] px-2.5"
                        >
                          Manage
                        </Button>

                        <ConfirmModal
                          onConfirm={() => handleDeactivateTeacher(t.id)}
                          title="Suspend Teacher"
                          description={`Suspend instructor privileges for ${t.email}?`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-[10px] text-destructive hover:text-destructive"
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

      {/* --- Add Teacher Dialog --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-[10px] max-w-md">
          <DialogHeader>
            <DialogTitle>Add Instructor / Teacher</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Teacher Name *</label>
              <Input
                placeholder="Dr. Sarah Jenkins"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Email Address *</label>
              <Input
                type="email"
                placeholder="sarah@university.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-[10px] text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phone Number</label>
              <Input
                placeholder="+1 555-0144"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Bio / Qualifications</label>
              <Textarea
                placeholder="Specialist in Distributed Systems, 10+ years teaching experience..."
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                rows={3}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Profile Avatar Image</span>
                {uploading && (
                  <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  placeholder="https://... or upload photo"
                  className="rounded-[10px] text-xs"
                />
                <label className="cursor-pointer shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatarUpload(f, false);
                    }}
                  />
                  <div className="h-9 px-3 rounded-[10px] border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleCreateTeacher} disabled={loading} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Create Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Manage Teacher Dialog --- */}
      <Dialog open={Boolean(selectedTeacher)} onOpenChange={(open) => !open && setSelectedTeacher(null)}>
        <DialogContent className="rounded-[10px] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Teacher: {selectedTeacher?.name || selectedTeacher?.email}</DialogTitle>
          </DialogHeader>

          {selectedTeacher && (
            <div className="space-y-5 py-2">
              <div className="space-y-3 p-4 rounded-[10px] border bg-muted/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Teacher Profile
                </h4>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-[10px] overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                    {editAvatar && typeof editAvatar === "string" && editAvatar.startsWith("http") ? (
                      <Image src={editAvatar} alt="Avatar" fill unoptimized className="object-cover" />
                    ) : (
                      <User className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleAvatarUpload(f, true);
                        }}
                      />
                      <div className="h-8 px-3 rounded-[10px] border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        Change Avatar
                      </div>
                    </label>
                  </div>
                </div>

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
                  <label className="text-xs font-semibold">Bio</label>
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="rounded-[10px] text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-[10px] border bg-background text-xs font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              {/* Assigned Courses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Teacher&apos;s Courses ({selectedTeacher.coursesCreated?.length || 0})
                </h4>
                {!selectedTeacher.coursesCreated || selectedTeacher.coursesCreated.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 border rounded-[10px] bg-card">
                    No courses currently assigned to this teacher.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedTeacher.coursesCreated.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-[10px] border bg-card flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {c.isPublished ? "Published" : "Draft"} • ${c.price}
                          </p>
                        </div>
                        <Link href={`/admin/courses/${c.id}`} target="_blank">
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-[10px] gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTeacher(null)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleUpdateTeacher} disabled={loading} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
