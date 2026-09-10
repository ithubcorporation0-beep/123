"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  Link2,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

export interface LessonItem {
  id: string;
  title: string;
  position: number;
  isFree: boolean;
  isPublished: boolean;
  contentType: string;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  duration?: string | null;
  externalUrl?: string | null;
  content?: string | null;
  resources?: { id: string; title: string; fileUrl: string }[];
}

export interface ModuleItem {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: LessonItem[];
}

interface AdminCurriculumManagerProps {
  courseId: string;
  courseTitle: string;
  initialModules: ModuleItem[];
}

export function AdminCurriculumManager({
  courseId,
  courseTitle,
  initialModules,
}: AdminCurriculumManagerProps) {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [loading, setLoading] = useState(false);

  // Module Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editModuleDesc, setEditModuleDesc] = useState("");

  // Lesson Modals state
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: LessonItem } | null>(null);

  // Lesson Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonVideoThumb, setLessonVideoThumb] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonExternalUrl, setLessonExternalUrl] = useState("");
  const [lessonDocUrl, setLessonDocUrl] = useState("");
  const [lessonDocTitle, setLessonDocTitle] = useState("");
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [lessonIsPublished, setLessonIsPublished] = useState(true);

  // Uploading state
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Handle File Upload Helper
  const handleUpload = async (file: File, type: "image" | "video" | "pdf" | "document") => {
    try {
      setUploadingField(type);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      toast.success(`${type.toUpperCase()} uploaded successfully!`);
      return data.url;
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
      return null;
    } finally {
      setUploadingField(null);
    }
  };

  // --- Module Actions ---
  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("Module title is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newModuleTitle,
          description: newModuleDesc,
        }),
      });

      if (!res.ok) throw new Error("Failed to create module");
      const created = await res.json();

      setModules((prev) => [...prev, { ...created, lessons: [] }]);
      setIsAddModuleOpen(false);
      setNewModuleTitle("");
      setNewModuleDesc("");
      toast.success("Module created successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async () => {
    if (!editingModule || !editModuleTitle.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${editingModule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editModuleTitle,
          description: editModuleDesc,
        }),
      });

      if (!res.ok) throw new Error("Failed to update module");
      const updated = await res.json();

      setModules((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
      );
      setEditingModule(null);
      toast.success("Module updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update module");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete module");

      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete module");
    } finally {
      setLoading(false);
    }
  };

  // Reorder modules
  const handleMoveModule = async (index: number, direction: "up" | "down") => {
    const newModules = [...modules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    const [moved] = newModules.splice(index, 1);
    newModules.splice(targetIndex, 0, moved);

    const updatedList = newModules.map((m, idx) => ({ ...m, position: idx + 1 }));
    setModules(updatedList);

    try {
      await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: updatedList.map((m) => ({ id: m.id, position: m.position })) }),
      });
      toast.success("Module order saved");
    } catch {
      toast.error("Failed to reorder modules");
    }
  };

  // --- Lesson Actions ---
  const openAddLesson = (moduleId: string) => {
    setTargetModuleId(moduleId);
    setLessonTitle("");
    setLessonContent("");
    setLessonVideoUrl("");
    setLessonVideoThumb("");
    setLessonDuration("");
    setLessonExternalUrl("");
    setLessonDocUrl("");
    setLessonDocTitle("");
    setLessonIsFree(false);
    setLessonIsPublished(true);
    setIsAddLessonOpen(true);
  };

  const openEditLesson = (moduleId: string, lesson: LessonItem) => {
    setEditingLesson({ moduleId, lesson });
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || "");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonVideoThumb(lesson.videoThumbnail || "");
    setLessonDuration(lesson.duration || "");
    setLessonExternalUrl(lesson.externalUrl || "");
    const primaryResource = lesson.resources?.[0];
    setLessonDocUrl(primaryResource?.fileUrl || "");
    setLessonDocTitle(primaryResource?.title || "");
    setLessonIsFree(lesson.isFree);
    setLessonIsPublished(lesson.isPublished);
  };

  const handleSaveLesson = async (isEdit: boolean) => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    const payload = {
      title: lessonTitle,
      content: lessonContent,
      videoUrl: lessonVideoUrl,
      videoThumbnail: lessonVideoThumb,
      duration: lessonDuration,
      externalUrl: lessonExternalUrl,
      resourceFileUrl: lessonDocUrl,
      resourceTitle: lessonDocTitle || "Lesson Document",
      isFree: lessonIsFree,
      isPublished: lessonIsPublished,
    };

    try {
      setLoading(true);

      if (isEdit && editingLesson) {
        const res = await fetch(
          `/api/admin/courses/${courseId}/modules/${editingLesson.moduleId}/lessons/${editingLesson.lesson.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Failed to update lesson");
        const updated = await res.json();

        setModules((prev) =>
          prev.map((m) =>
            m.id === editingLesson.moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) => (l.id === updated.id ? updated : l)),
                }
              : m
          )
        );

        setEditingLesson(null);
        toast.success("Lesson updated!");
      } else if (targetModuleId) {
        const res = await fetch(
          `/api/admin/courses/${courseId}/modules/${targetModuleId}/lessons`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Failed to create lesson");
        const created = await res.json();

        setModules((prev) =>
          prev.map((m) =>
            m.id === targetModuleId
              ? { ...m, lessons: [...m.lessons, created] }
              : m
          )
        );

        setIsAddLessonOpen(false);
        toast.success("Lesson added!");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete lesson");

      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );

      toast.success("Lesson removed!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border">
        <div>
          <h2 className="text-lg font-bold text-foreground">Course Curriculum</h2>
          <p className="text-xs text-muted-foreground">
            Structure: Course → Modules → Lessons. Add videos, PDFs, descriptions, and resources.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModuleOpen(true)}
          className="rounded-2xl text-xs gap-1.5 font-bold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card className="rounded-2xl border bg-card p-10 text-center">
          <div className="max-w-sm mx-auto space-y-3">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold">No Curriculum Modules Yet</h3>
            <p className="text-xs text-muted-foreground">
              Create your first module (e.g., &quot;Module 1: Getting Started&quot;) to start organizing video lectures and lessons.
            </p>
            <Button
              onClick={() => setIsAddModuleOpen(true)}
              className="rounded-2xl text-xs gap-1.5 font-bold"
            >
              <Plus className="h-4 w-4" />
              Create First Module
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <Card key={mod.id} className="rounded-2xl border bg-card shadow-xs overflow-hidden">
              {/* Module Header Bar */}
              <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={modIdx === 0}
                      onClick={() => handleMoveModule(modIdx, "up")}
                      className="h-7 w-7 rounded-lg"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={modIdx === modules.length - 1}
                      onClick={() => handleMoveModule(modIdx, "down")}
                      className="h-7 w-7 rounded-lg"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        Module {modIdx + 1}:
                      </span>
                      <h3 className="text-sm font-bold text-foreground">{mod.title}</h3>
                    </div>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddLesson(mod.id)}
                    className="h-8 text-xs rounded-xl gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Lesson
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingModule(mod);
                      setEditModuleTitle(mod.title);
                      setEditModuleDesc(mod.description || "");
                    }}
                    className="h-8 w-8 rounded-xl"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmModal
                    onConfirm={() => handleDeleteModule(mod.id)}
                    title="Delete Module"
                    description={`Are you sure you want to delete "${mod.title}" and all of its ${mod.lessons.length} lessons?`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </ConfirmModal>
                </div>
              </div>

              {/* Module Lessons Container */}
              <CardContent className="p-4 space-y-2">
                {mod.lessons.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No lessons in this module.{" "}
                    <button
                      onClick={() => openAddLesson(mod.id)}
                      className="text-primary underline font-medium cursor-pointer"
                    >
                      Add a lesson now.
                    </button>
                  </div>
                ) : (
                  mod.lessons.map((lesson, lessonIdx) => (
                    <div
                      key={lesson.id}
                      className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                          {lesson.videoUrl ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {lessonIdx + 1}. {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold">
                                FREE
                              </Badge>
                            )}
                            <Badge
                              variant={lesson.isPublished ? "default" : "outline"}
                              className="text-[9px] px-1.5 py-0 font-bold"
                            >
                              {lesson.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                            {lesson.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}
                              </span>
                            )}
                            {lesson.resources && lesson.resources.length > 0 && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <FileUp className="h-3 w-3" />
                                Document attached
                              </span>
                            )}
                            {lesson.videoUrl && (
                              <span className="text-blue-600 truncate max-w-[200px]">
                                Video attached
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditLesson(mod.id, lesson)}
                          className="h-7 w-7 rounded-lg"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <ConfirmModal
                          onConfirm={() => handleDeleteLesson(mod.id, lesson.id)}
                          title="Delete Lesson"
                          description={`Are you sure you want to delete "${lesson.title}"?`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmModal>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Add Module Dialog --- */}
      <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Add Curriculum Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Module Title *</label>
              <Input
                placeholder="e.g. Module 1: Introduction & Fundamentals"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Description (optional)</label>
              <Textarea
                placeholder="Brief summary of what this module covers..."
                value={newModuleDesc}
                onChange={(e) => setNewModuleDesc(e.target.value)}
                rows={3}
                className="rounded-xl text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModuleOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreateModule} disabled={loading} className="rounded-xl font-semibold">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Create Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Edit Module Dialog --- */}
      <Dialog open={Boolean(editingModule)} onOpenChange={(open) => !open && setEditingModule(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Module Title *</label>
              <Input
                value={editModuleTitle}
                onChange={(e) => setEditModuleTitle(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Description</label>
              <Textarea
                value={editModuleDesc}
                onChange={(e) => setEditModuleDesc(e.target.value)}
                rows={3}
                className="rounded-xl text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingModule(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleUpdateModule} disabled={loading} className="rounded-xl font-semibold">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Add / Edit Lesson Dialog --- */}
      <Dialog
        open={isAddLessonOpen || Boolean(editingLesson)}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddLessonOpen(false);
            setEditingLesson(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit Lesson Details" : "Add New Lesson"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Lesson Title *</label>
              <Input
                placeholder="e.g. 1.1 Course Architecture & Principles"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Video Upload & URL */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-primary" />
                  Lesson Video
                </label>
                {uploadingField === "video" && (
                  <span className="text-[11px] text-primary flex items-center gap-1 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading video...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Direct Video URL (MP4 / HLS / Cloudinary)"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleUpload(file, "video");
                          if (url) setLessonVideoUrl(url);
                        }
                      }}
                    />
                    <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Video
                    </div>
                  </label>
                </div>
              </div>
              {lessonVideoUrl && (
                <p className="text-[11px] text-emerald-600 truncate font-mono">
                  Active video: {lessonVideoUrl}
                </p>
              )}
            </div>

            {/* Video Thumbnail & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Video Thumbnail URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://... or upload"
                    value={lessonVideoThumb}
                    onChange={(e) => setLessonVideoThumb(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleUpload(file, "image");
                          if (url) setLessonVideoThumb(url);
                        }
                      }}
                    />
                    <div className="h-9 px-2.5 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center justify-center gap-1">
                      <Upload className="h-3 w-3" />
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Duration</label>
                <Input
                  placeholder="e.g. 15 mins"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            {/* PDF / Document Attachment */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <FileUp className="h-4 w-4 text-primary" />
                  PDF / Document Resource
                </label>
                {uploadingField === "pdf" && (
                  <span className="text-[11px] text-primary flex items-center gap-1 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading document...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Resource Title (e.g. Lecture Slides PDF)"
                  value={lessonDocTitle}
                  onChange={(e) => setLessonDocTitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="PDF / Document URL"
                    value={lessonDocUrl}
                    onChange={(e) => setLessonDocUrl(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleUpload(file, "pdf");
                          if (url) setLessonDocUrl(url);
                        }
                      }}
                    />
                    <div className="h-9 px-2.5 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center justify-center gap-1">
                      <Upload className="h-3 w-3" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* External Resource Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5 text-primary" />
                External Resource / Link
              </label>
              <Input
                placeholder="e.g. https://github.com/repository-link"
                value={lessonExternalUrl}
                onChange={(e) => setLessonExternalUrl(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Lesson Text / Markdown Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Lesson Text Content (Markdown / Instructions)</label>
              <Textarea
                placeholder="Detailed text, lecture notes, or key takeaways for this lesson..."
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                rows={4}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Toggles: Free Preview & Published */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => setLessonIsFree(!lessonIsFree)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  lessonIsFree ? "bg-primary/5 border-primary/40" : "bg-card hover:bg-muted/30"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Free Preview</p>
                  <p className="text-[10px] text-muted-foreground">Accessible without enrollment</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    lessonIsFree ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {lessonIsFree && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
              </div>

              <div
                onClick={() => setLessonIsPublished(!lessonIsPublished)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  lessonIsPublished ? "bg-primary/5 border-primary/40" : "bg-card hover:bg-muted/30"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Published</p>
                  <p className="text-[10px] text-muted-foreground">Visible to learners</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    lessonIsPublished ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {lessonIsPublished && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddLessonOpen(false);
                setEditingLesson(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveLesson(Boolean(editingLesson))}
              disabled={loading}
              className="rounded-xl font-semibold"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              {editingLesson ? "Save Changes" : "Create Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
