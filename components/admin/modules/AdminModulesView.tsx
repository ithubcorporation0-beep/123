"use client";

import { useState, useEffect } from "react";
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
  Layers,
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
}

interface ModuleItem {
  id: string;
  title: string;
  description: string | null;
  position: number;
  courseId: string;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
  lessons: Array<{ id: string; title: string; duration: string | null }>;
}

export function AdminModulesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Create / Edit modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);
  const [formCourseId, setFormCourseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteConfirmModule, setDeleteConfirmModule] = useState<ModuleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchModules();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  };

  const fetchModules = async (courseId?: string) => {
    setLoading(true);
    try {
      const cid = courseId !== undefined ? courseId : selectedCourseId;
      const url = cid && cid !== "all" ? `/api/admin/modules?courseId=${cid}` : "/api/admin/modules";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setModules(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load modules", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterCourse = (cid: string) => {
    setSelectedCourseId(cid);
    fetchModules(cid);
  };

  const openCreateDialog = () => {
    setEditingModule(null);
    setFormCourseId(selectedCourseId !== "all" ? selectedCourseId : courses[0]?.id || "");
    setFormTitle("");
    setFormDesc("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (mod: ModuleItem) => {
    setEditingModule(mod);
    setFormCourseId(mod.courseId);
    setFormTitle(mod.title);
    setFormDesc(mod.description || "");
    setIsDialogOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSubmitting(true);
    try {
      if (editingModule) {
        const res = await fetch(`/api/admin/modules/${editingModule.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDesc.trim() || null,
          }),
        });
        if (res.ok) {
          setIsDialogOpen(false);
          fetchModules();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update module");
        }
      } else {
        const res = await fetch("/api/admin/modules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: formCourseId,
            title: formTitle.trim(),
            description: formDesc.trim() || null,
          }),
        });
        if (res.ok) {
          setIsDialogOpen(false);
          fetchModules();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to create module");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!deleteConfirmModule) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/modules/${deleteConfirmModule.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmModule(null);
        fetchModules();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete module");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting module");
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredModules.length) return;

    const currentItem = filteredModules[index];
    const targetItem = filteredModules[targetIndex];

    // Only swap if they belong to the same course
    if (currentItem.courseId !== targetItem.courseId) return;

    const updated = [...filteredModules];
    const tempPos = currentItem.position;
    currentItem.position = targetItem.position;
    targetItem.position = tempPos;

    updated[index] = targetItem;
    updated[targetIndex] = currentItem;
    setModules(updated);

    try {
      await fetch("/api/admin/modules", {
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
      console.error("Failed to persist reorder", err);
      fetchModules();
    }
  };

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase())) ||
      m.course.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#194866] font-normal tracking-tight">
            Modules Management
          </h1>
          <p className="text-sm text-[#545454] mt-1">
            Organize course chapters, syllabi, and learning units.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="rounded-[40px] px-5 py-2.5 h-auto font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Module</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-[16px] border border-[#DEDEDE]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#545454]" />
          <Input
            placeholder="Search modules or courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-[4px] border-[#DEDEDE] text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold text-[#545454] whitespace-nowrap">Filter Course:</Label>
          <select
            value={selectedCourseId}
            onChange={(e) => handleFilterCourse(e.target.value)}
            className="h-10 px-3 py-2 rounded-[4px] border border-[#DEDEDE] bg-white text-xs font-medium text-[#282828] focus:outline-none focus:border-[#194866]"
          >
            <option value="all">All Courses ({courses.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#194866] mb-3" />
          <p className="text-sm text-[#545454]">Loading modules from database...</p>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <Layers className="h-10 w-10 text-[#545454] mx-auto mb-3 opacity-40" />
          <h3 className="font-serif text-lg text-[#194866]">No modules found</h3>
          <p className="text-xs text-[#545454] mt-1 max-w-sm mx-auto">
            Get started by creating your first course module to organize lessons and syllabus topics.
          </p>
          <Button
            onClick={openCreateDialog}
            className="mt-4 rounded-[40px] px-5 py-2 h-auto text-xs font-semibold bg-[#194866] text-white"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create First Module
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModules.map((mod, idx) => (
            <div
              key={mod.id}
              className="p-5 rounded-[16px] border border-[#DEDEDE] bg-white hover:border-[#194866]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-[12px] bg-[#F2F2F2] border border-[#DEDEDE] text-[#194866] shrink-0 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-base text-[#194866] font-medium truncate">
                      {mod.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-[30px] bg-[#F2F2F2] border border-[#DEDEDE] text-[10px] font-semibold text-[#545454]">
                      {mod.course.title}
                    </span>
                  </div>
                  {mod.description && (
                    <p className="text-xs text-[#545454] line-clamp-1">{mod.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#545454] pt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-[#194866]" />
                      {mod.lessons.length} {mod.lessons.length === 1 ? "Lesson" : "Lessons"}
                    </span>
                    <Link
                      href={`/admin/lessons?courseId=${mod.courseId}&moduleId=${mod.id}`}
                      className="text-[#194866] font-semibold hover:underline flex items-center gap-1"
                    >
                      Manage Lessons &rarr;
                    </Link>
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
                  disabled={idx === filteredModules.length - 1}
                  className="h-8 w-8 p-0 rounded-[4px] border-[#DEDEDE] text-[#545454] hover:text-[#194866]"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(mod)}
                  className="h-8 px-2.5 rounded-[4px] border-[#DEDEDE] text-xs font-semibold text-[#194866] hover:bg-[#F2F2F2] gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteConfirmModule(mod)}
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
        <DialogContent className="sm:max-w-md rounded-[16px] bg-white border-[#DEDEDE]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#194866]">
              {editingModule ? "Edit Module" : "Add Course Module"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveModule} className="space-y-4 py-2">
            {!editingModule && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#282828]">Assigned Course *</Label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-[4px] border border-[#DEDEDE] bg-white text-xs font-medium text-[#282828] focus:outline-none focus:border-[#194866]"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#282828]">Module Title *</Label>
              <Input
                placeholder="e.g. Module 1: Fundamentals of Cloud Architecture"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="rounded-[4px] border-[#DEDEDE] text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#282828]">Description (Optional)</Label>
              <Textarea
                placeholder="Key concepts, syllabus overview, and outcomes for this module..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="rounded-[4px] border-[#DEDEDE] text-sm min-h-[90px]"
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
                disabled={submitting}
                className="rounded-[40px] px-5 text-xs font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingModule ? "Save Changes" : "Create Module"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmModule} onOpenChange={(open) => !open && setDeleteConfirmModule(null)}>
        <DialogContent className="sm:max-w-md rounded-[16px] bg-white border-[#DEDEDE]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Module?
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm text-[#545454] space-y-2">
            <p>
              Are you sure you want to permanently delete module <strong>"{deleteConfirmModule?.title}"</strong>?
            </p>
            <p className="text-xs text-rose-600 font-medium">
              This will also remove any lessons contained inside this module.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmModule(null)}
              className="rounded-[40px] px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteModule}
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
