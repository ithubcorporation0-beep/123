"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Plus,
  Search,
  Video,
  FileText,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  CheckCircle,
  Clock,
  Eye,
  ExternalLink,
  AlertCircle,
  UploadCloud,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  modules?: Array<{ id: string; title: string }>;
}

interface ModuleItem {
  id: string;
  title: string;
  courseId: string;
  course: { id: string; title: string };
}

interface LessonItem {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  videoThumbnail: string | null;
  duration: string | null;
  isFree: boolean;
  isPublished: boolean;
  position: number;
  moduleId: string;
  module: {
    id: string;
    title: string;
    courseId: string;
    course: { id: string; title: string; thumbnail: string | null };
  };
  resources: Array<{ id: string; title: string; fileUrl: string }>;
}

export function AdminLessonsView() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "all";
  const initialModuleId = searchParams.get("moduleId") || "all";

  const [courses, setCourses] = useState<Course[]>([]);
  const [allModules, setAllModules] = useState<ModuleItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // Form Fields
  const [formModuleId, setFormModuleId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formVideoThumb, setFormVideoThumb] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formIsFree, setFormIsFree] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formPdfTitle, setFormPdfTitle] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteConfirmLesson, setDeleteConfirmLesson] = useState<LessonItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchLessons();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [coursesRes, modulesRes] = await Promise.all([
        fetch("/api/admin/courses"),
        fetch("/api/admin/modules"),
      ]);
      if (coursesRes.ok) {
        const cdata = await coursesRes.json();
        setCourses(Array.isArray(cdata) ? cdata : []);
      }
      if (modulesRes.ok) {
        const mdata = await modulesRes.json();
        setAllModules(Array.isArray(mdata) ? mdata : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessons = async (cid?: string, mid?: string) => {
    setLoading(true);
    try {
      const c = cid !== undefined ? cid : selectedCourseId;
      const m = mid !== undefined ? mid : selectedModuleId;

      const params = new URLSearchParams();
      if (c && c !== "all") params.append("courseId", c);
      if (m && m !== "all") params.append("moduleId", m);

      const url = `/api/admin/lessons?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLessons(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load lessons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterCourse = (cid: string) => {
    setSelectedCourseId(cid);
    setSelectedModuleId("all");
    fetchLessons(cid, "all");
  };

  const handleFilterModule = (mid: string) => {
    setSelectedModuleId(mid);
    fetchLessons(selectedCourseId, mid);
  };

  const openCreateDialog = () => {
    setEditingLesson(null);
    const availableModules = selectedCourseId !== "all" 
      ? allModules.filter((m) => m.courseId === selectedCourseId)
      : allModules;

    setFormModuleId(selectedModuleId !== "all" ? selectedModuleId : availableModules[0]?.id || "");
    setFormTitle("");
    setFormContent("");
    setFormVideoUrl("");
    setFormVideoThumb("");
    setFormDuration("");
    setFormIsFree(false);
    setFormIsPublished(true);
    setFormPdfUrl("");
    setFormPdfTitle("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (l: LessonItem) => {
    setEditingLesson(l);
    setFormModuleId(l.moduleId);
    setFormTitle(l.title);
    setFormContent(l.content || "");
    setFormVideoUrl(l.videoUrl || "");
    setFormVideoThumb(l.videoThumbnail || "");
    setFormDuration(l.duration || "");
    setFormIsFree(l.isFree);
    setFormIsPublished(l.isPublished);
    setFormPdfUrl(l.resources?.[0]?.fileUrl || "");
    setFormPdfTitle(l.resources?.[0]?.title || "");
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (file: File, type: "video" | "thumbnail" | "pdf") => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", type === "video" ? "lesson-videos" : type === "pdf" ? "documents" : "lesson-images");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (type === "video") setFormVideoUrl(data.url);
        if (type === "thumbnail") setFormVideoThumb(data.url);
        if (type === "pdf") {
          setFormPdfUrl(data.url);
          if (!formPdfTitle) setFormPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        alert("Upload failed. Please check file type and size.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSubmitting(true);
    try {
      if (editingLesson) {
        const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            content: formContent.trim() || null,
            videoUrl: formVideoUrl.trim() || null,
            videoThumbnail: formVideoThumb.trim() || null,
            duration: formDuration.trim() || null,
            isFree: formIsFree,
            isPublished: formIsPublished,
            resourceFileUrl: formPdfUrl.trim() || null,
            resourceTitle: formPdfTitle.trim() || null,
          }),
        });
        if (res.ok) {
          setIsDialogOpen(false);
          fetchLessons();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update lesson");
        }
      } else {
        const res = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleId: formModuleId,
            title: formTitle.trim(),
            textContent: formContent.trim() || null,
            videoUrl: formVideoUrl.trim() || null,
            videoThumbnail: formVideoThumb.trim() || null,
            duration: formDuration.trim() || null,
            isFree: formIsFree,
            isPublished: formIsPublished,
            resourceFileUrl: formPdfUrl.trim() || null,
            resourceTitle: formPdfTitle.trim() || null,
          }),
        });
        if (res.ok) {
          setIsDialogOpen(false);
          fetchLessons();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to create lesson");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving lesson");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteConfirmLesson) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/lessons/${deleteConfirmLesson.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmLesson(null);
        fetchLessons();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete lesson");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lesson");
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredLessons.length) return;

    const currentItem = filteredLessons[index];
    const targetItem = filteredLessons[targetIndex];

    if (currentItem.moduleId !== targetItem.moduleId) return;

    const updated = [...filteredLessons];
    const tempPos = currentItem.position;
    currentItem.position = targetItem.position;
    targetItem.position = tempPos;

    updated[index] = targetItem;
    updated[targetIndex] = currentItem;
    setLessons(updated);

    try {
      await fetch("/api/admin/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { id: currentItem.id, position: currentItem.position },
            { id: targetItem.id, position: targetItem.position },
          ],
        }),
      });
    } catch (err) {
      console.error(err);
      fetchLessons();
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.content && l.content.toLowerCase().includes(search.toLowerCase())) ||
      l.module.title.toLowerCase().includes(search.toLowerCase()) ||
      l.module.course.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const availableModulesForFilter = selectedCourseId !== "all"
    ? allModules.filter((m) => m.courseId === selectedCourseId)
    : allModules;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#194866] font-normal tracking-tight">
            Lessons Management
          </h1>
          <p className="text-sm text-[#545454] mt-1">
            Build video lectures, upload PDF attachments, and author learning materials.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="rounded-[40px] px-5 py-2.5 h-auto font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lesson</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-[16px] border border-[#DEDEDE]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#545454]" />
          <Input
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-[4px] border-[#DEDEDE] text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold text-[#545454] whitespace-nowrap">Course:</Label>
          <select
            value={selectedCourseId}
            onChange={(e) => handleFilterCourse(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-[4px] border border-[#DEDEDE] bg-white text-xs font-medium text-[#282828] focus:outline-none focus:border-[#194866]"
          >
            <option value="all">All Courses ({courses.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold text-[#545454] whitespace-nowrap">Module:</Label>
          <select
            value={selectedModuleId}
            onChange={(e) => handleFilterModule(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-[4px] border border-[#DEDEDE] bg-white text-xs font-medium text-[#282828] focus:outline-none focus:border-[#194866]"
          >
            <option value="all">All Modules ({availableModulesForFilter.length})</option>
            {availableModulesForFilter.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#194866] mb-3" />
          <p className="text-sm text-[#545454]">Loading lessons from database...</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <BookOpen className="h-10 w-10 text-[#545454] mx-auto mb-3 opacity-40" />
          <h3 className="font-serif text-lg text-[#194866]">No lessons found</h3>
          <p className="text-xs text-[#545454] mt-1 max-w-sm mx-auto">
            Add lecture videos, textual guides, and downloadable resources to your modules.
          </p>
          <Button
            onClick={openCreateDialog}
            className="mt-4 rounded-[40px] px-5 py-2 h-auto text-xs font-semibold bg-[#194866] text-white"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add First Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="p-4 sm:p-5 rounded-[16px] border border-[#DEDEDE] bg-white hover:border-[#194866]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-[12px] bg-[#F2F2F2] border border-[#DEDEDE] text-[#194866] shrink-0 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-base text-[#194866] font-medium">
                      {lesson.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-[30px] bg-[#194866]/10 text-[#194866] text-[10px] font-semibold">
                      {lesson.module.course.title} &bull; {lesson.module.title}
                    </span>
                    {lesson.isFree ? (
                      <span className="px-2 py-0.5 rounded-[30px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        FREE PREVIEW
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-[30px] bg-[#F2F2F2] text-[#545454] text-[10px] font-semibold">
                        PAID
                      </span>
                    )}
                    {lesson.isPublished ? (
                      <span className="px-2 py-0.5 rounded-[30px] bg-sky-50 text-sky-700 text-[10px] font-semibold">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-[30px] bg-amber-50 text-amber-700 text-[10px] font-semibold">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#545454] pt-1">
                    {lesson.duration && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3.5 w-3.5 text-[#194866]" />
                        {lesson.duration}
                      </span>
                    )}
                    {lesson.videoUrl && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Video className="h-3.5 w-3.5" />
                        Video Attached
                      </span>
                    )}
                    {lesson.resources.length > 0 && (
                      <span className="flex items-center gap-1 text-[#194866] font-medium">
                        <FileText className="h-3.5 w-3.5" />
                        {lesson.resources.length} Document(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="h-8 w-8 p-0 rounded-[4px] border-[#DEDEDE] text-[#545454] hover:text-[#194866]"
                  title="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === filteredLessons.length - 1}
                  className="h-8 w-8 p-0 rounded-[4px] border-[#DEDEDE] text-[#545454] hover:text-[#194866]"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(lesson)}
                  className="h-8 px-2.5 rounded-[4px] border-[#DEDEDE] text-xs font-semibold text-[#194866] hover:bg-[#F2F2F2] gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteConfirmLesson(lesson)}
                  className="h-8 px-2.5 rounded-[4px] border-[#DEDEDE] text-xs font-semibold text-rose-600 hover:bg-rose-50 gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[16px] bg-white border-[#DEDEDE]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#194866]">
              {editingLesson ? `Edit: ${editingLesson.title}` : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveLesson} className="space-y-4 py-2">
            {!editingLesson && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#282828]">Assigned Module *</Label>
                <select
                  value={formModuleId}
                  onChange={(e) => setFormModuleId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-[4px] border border-[#DEDEDE] bg-white text-xs font-medium text-[#282828] focus:outline-none focus:border-[#194866]"
                  required
                >
                  {allModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.course.title} &bull; {m.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-[#282828]">Lesson Title *</Label>
                <Input
                  placeholder="e.g. Next.js 16 Server Actions & Edge Middleware"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="rounded-[4px] border-[#DEDEDE] text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#282828]">Duration (Estimated)</Label>
                <Input
                  placeholder="e.g. 24 mins"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="rounded-[4px] border-[#DEDEDE] text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#282828] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFree}
                    onChange={(e) => setFormIsFree(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DEDEDE] text-[#194866]"
                  />
                  <span>Free Preview Lesson</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#282828] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DEDEDE] text-[#194866]"
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            {/* Video Section */}
            <div className="p-4 rounded-[12px] bg-[#F2F2F2] border border-[#DEDEDE] space-y-3">
              <Label className="text-xs font-bold text-[#194866] flex items-center gap-1.5">
                <Video className="h-4 w-4" /> Lesson Video
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-[#545454]">Video URL (Direct link, YouTube, or Vimeo)</Label>
                  <Input
                    placeholder="https://..."
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    className="rounded-[4px] border-[#DEDEDE] text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-[#545454]">Or Upload Video File</Label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "video")}
                    className="block w-full text-xs text-[#545454] file:mr-2 file:py-1 file:px-3 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#194866] file:text-white hover:file:bg-[#194866]/90 cursor-pointer"
                  />
                </div>
              </div>

              {formVideoUrl && (
                <div className="flex items-center justify-between text-xs text-[#194866] font-medium pt-1">
                  <span className="truncate max-w-sm">Attached: {formVideoUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormVideoUrl("")}
                    className="text-xs text-rose-600 h-6 px-2"
                  >
                    Remove Video
                  </Button>
                </div>
              )}
            </div>

            {/* Lesson Resources / PDF Document */}
            <div className="p-4 rounded-[12px] bg-[#F2F2F2] border border-[#DEDEDE] space-y-3">
              <Label className="text-xs font-bold text-[#194866] flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Downloadable PDF / Study Guide
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-[#545454]">Document Title</Label>
                  <Input
                    placeholder="e.g. Lesson Cheat Sheet & Architecture Diagrams"
                    value={formPdfTitle}
                    onChange={(e) => setFormPdfTitle(e.target.value)}
                    className="rounded-[4px] border-[#DEDEDE] text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-[#545454]">Upload PDF / Resource File</Label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.png,.jpg"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "pdf")}
                    className="block w-full text-xs text-[#545454] file:mr-2 file:py-1 file:px-3 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#194866] file:text-white hover:file:bg-[#194866]/90 cursor-pointer"
                  />
                </div>
              </div>
              {formPdfUrl && (
                <div className="flex items-center justify-between text-xs text-[#194866] font-medium pt-1">
                  <span className="truncate max-w-sm">File: {formPdfUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormPdfUrl("");
                      setFormPdfTitle("");
                    }}
                    className="text-xs text-rose-600 h-6 px-2"
                  >
                    Remove Resource
                  </Button>
                </div>
              )}
            </div>

            {/* Lesson Content Text */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#282828]">Lesson Content / Markdown Guide</Label>
              <Textarea
                placeholder="Detailed explanations, code blocks, instructions, or reading material..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="rounded-[4px] border-[#DEDEDE] text-sm min-h-[140px] font-mono text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-[40px] px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploading}
                className="rounded-[40px] px-5 text-xs font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingLesson ? "Save Changes" : "Create Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmLesson} onOpenChange={(open) => !open && setDeleteConfirmLesson(null)}>
        <DialogContent className="sm:max-w-md rounded-[16px] bg-white border-[#DEDEDE]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Lesson?
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm text-[#545454] space-y-2">
            <p>
              Are you sure you want to permanently delete lesson <strong>"{deleteConfirmLesson?.title}"</strong>?
            </p>
            <p className="text-xs text-[#545454]">
              This action cannot be undone and will remove related student progress records for this lesson.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmLesson(null)}
              className="rounded-[40px] px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteLesson}
              disabled={deleting}
              className="rounded-[40px] px-5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
