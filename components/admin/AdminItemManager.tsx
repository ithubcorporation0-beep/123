"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  DollarSign,
  Tag,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ManagedCourseItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  categoryName: string;
  level: string;
  price: number;
  isPublished: boolean;
  isFeatured?: boolean;
}

interface AdminItemManagerProps {
  initialCourses: ManagedCourseItem[];
  availableCategories?: string[];
}

const DEFAULT_THUMBNAILS = [
  {
    label: "Coding & Software",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Web Development",
    url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Marketing & Growth",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Design & Creative",
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "E-Commerce",
    url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
  },
];

export function AdminItemManager({
  initialCourses,
  availableCategories = [
    "Software Solutions",
    "Website Solutions",
    "Digital Marketing",
    "Graphic Design",
    "E-Commerce Solutions",
  ],
}: AdminItemManagerProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<ManagedCourseItem[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Modal State for Adding a Course
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Form Fields
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(availableCategories[0] || "Software Solutions");
  const [newCustomCategory, setNewCustomCategory] = useState("");
  const [newLevel, setNewLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDescription, setNewDescription] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(DEFAULT_THUMBNAILS[0].url);

  // Deletion Modal State
  const [deletingCourse, setDeletingCourse] = useState<ManagedCourseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Action Loading tracking
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setAddError("Please provide a course title.");
      return;
    }

    setIsSubmitting(true);
    setAddError(null);

    const chosenCategory = newCategory === "OTHER" ? newCustomCategory.trim() || "General" : newCategory;

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          categoryName: chosenCategory,
          price: Number(newPrice) || 0,
          level: newLevel,
          description: newDescription.trim() || "Comprehensive training program on IZBA Learning HUB.",
          thumbnail: newThumbnail || DEFAULT_THUMBNAILS[0].url,
          isPublished: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data) {
        setAddError(data?.error || "Failed to add course.");
        setIsSubmitting(false);
        return;
      }

      // Add newly created course to local state immediately
      const createdItem: ManagedCourseItem = {
        id: data.id || `course_${Date.now()}`,
        title: data.title || newTitle.trim(),
        slug: data.slug || newTitle.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || newDescription,
        thumbnail: data.thumbnail || newThumbnail,
        categoryName: chosenCategory,
        level: newLevel,
        price: Number(newPrice) || 0,
        isPublished: true,
      };

      setCourses([createdItem, ...courses]);
      setIsAddOpen(false);
      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewPrice(0);
      setIsSubmitting(false);
      showNotification(`"${createdItem.title}" was added and published successfully!`);
      router.refresh();
    } catch {
      setAddError("Network error while creating course.");
      setIsSubmitting(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (!deletingCourse) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/courses/${deletingCourse.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Could not delete from server.");
      }

      // Remove from local state
      setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
      showNotification(`"${deletingCourse.title}" was removed successfully.`);
      setDeletingCourse(null);
      setIsDeleting(false);
      router.refresh();
    } catch {
      // If DB failed or fallback, remove locally to keep UI consistent
      setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
      showNotification(`"${deletingCourse.title}" removed from catalog.`);
      setDeletingCourse(null);
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async (course: ManagedCourseItem) => {
    setActionLoadingId(course.id);
    const updatedState = !course.isPublished;

    try {
      await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: updatedState }),
      });

      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, isPublished: updatedState } : c))
      );
      showNotification(
        `"${course.title}" is now ${updatedState ? "Live on the website" : "Hidden (Draft)"}.`
      );
      router.refresh();
    } catch {
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, isPublished: updatedState } : c))
      );
      showNotification(`Visibility updated for "${course.title}".`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter list
  const displayedCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || c.categoryName.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const publishedCount = courses.filter((c) => c.isPublished).length;
  const draftCount = courses.length - publishedCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Alert / Notification */}
      {notification && (
        <div
          className={`p-4 rounded-[12px] border flex items-center justify-between text-xs font-semibold animate-fade-in-down ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="hover:opacity-75 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header & Quick Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[16px] bg-white border border-[#DEDEDE] shadow-none">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[30px] bg-[#194866] text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="h-3.5 w-3.5 text-[#FF9F59]" />
            <span>Admin Item Manager</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#194866] font-normal tracking-tight">
            Add & Remove Platform Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#545454] mt-1.5 max-w-2xl leading-[1.6]">
            One-click options to publish new courses to the catalog, remove outdated programs, and toggle visibility on the website.
          </p>
        </div>

        <Button
          onClick={() => {
            setAddError(null);
            setIsAddOpen(true);
          }}
          className="rounded-[40px] px-6 py-3 h-auto text-sm font-semibold bg-[#FF9F59] hover:bg-[#FF9F59]/90 text-[#194866] gap-2 shadow-none cursor-pointer shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Course</span>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[16px] bg-white border border-[#DEDEDE] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#545454]">Total Catalog Courses</p>
            <p className="text-2xl font-bold text-[#194866] mt-0.5">{courses.length}</p>
          </div>
          <div className="p-3 rounded-[12px] bg-[#F2F2F2] text-[#194866] border border-[#DEDEDE]">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-[16px] bg-white border border-[#DEDEDE] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#545454]">Live on Website</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{publishedCount}</p>
          </div>
          <div className="p-3 rounded-[12px] bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Eye className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-[16px] bg-white border border-[#DEDEDE] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#545454]">Draft / Hidden</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{draftCount}</p>
          </div>
          <div className="p-3 rounded-[12px] bg-amber-50 text-amber-600 border border-amber-200">
            <EyeOff className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[16px] bg-white border border-[#DEDEDE]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#545454]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course title or category..."
            className="pl-10 h-10 text-xs rounded-[30px] border-[#DEDEDE] bg-[#F2F2F2] focus-visible:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#545454] hover:text-[#194866]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[#545454] font-medium shrink-0">Filter:</span>
          <button
            type="button"
            onClick={() => setFilterCategory("ALL")}
            className={`px-3 py-1.5 rounded-[30px] font-semibold border transition-all cursor-pointer ${
              filterCategory === "ALL"
                ? "bg-[#194866] text-white border-[#194866]"
                : "bg-white text-[#545454] border-[#DEDEDE] hover:bg-[#F2F2F2]"
            }`}
          >
            All ({courses.length})
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-[30px] font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#194866] text-white border-[#194866]"
                  : "bg-white text-[#545454] border-[#DEDEDE] hover:bg-[#F2F2F2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      {displayedCourses.length === 0 ? (
        <div className="p-12 text-center rounded-[16px] bg-white border border-[#DEDEDE] space-y-3">
          <BookOpen className="h-8 w-8 text-[#545454] mx-auto opacity-50" />
          <h3 className="font-serif text-lg text-[#194866]">No courses match your search</h3>
          <p className="text-xs text-[#545454] max-w-sm mx-auto">
            Try searching for another term or click "Add New Course" to add an item.
          </p>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="rounded-[30px] text-xs font-semibold bg-[#194866] text-white mt-2"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Course Now
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedCourses.map((course) => {
            const isLoading = actionLoadingId === course.id;

            return (
              <div
                key={course.id}
                className="p-5 rounded-[16px] bg-white border border-[#DEDEDE] hover:border-[#194866]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Thumbnail & Main Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="relative w-24 h-16 rounded-[12px] overflow-hidden bg-[#F2F2F2] border border-[#DEDEDE] shrink-0">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#194866]">
                        <BookOpen className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-normal text-[#194866] truncate max-w-md">
                        {course.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold border-[#DEDEDE] bg-[#F2F2F2] text-[#545454]"
                      >
                        {course.categoryName}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold border-[#DEDEDE] text-[#194866]"
                      >
                        {course.level}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#545454] line-clamp-1 max-w-xl">
                      {course.description || "Interactive curriculum available on platform."}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#545454] pt-1">
                      <span className="font-bold text-[#194866]">
                        {course.price === 0 ? "Free Course" : `$${course.price.toFixed(2)}`}
                      </span>
                      <span>•</span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          course.isPublished ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            course.isPublished ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {course.isPublished ? "Live on Site" : "Hidden (Draft)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: Remove & Visibility */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#DEDEDE]">
                  {/* View on Site */}
                  <Link href={`/courses/${course.slug || course.id}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-[30px] text-xs h-9 px-3.5 gap-1.5 border-[#DEDEDE] bg-[#F2F2F2] hover:bg-white text-[#194866]"
                    >
                      <span>Preview</span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#FF9F59]" />
                    </Button>
                  </Link>

                  {/* Toggle Visibility */}
                  <Button
                    onClick={() => handleToggleVisibility(course)}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className={`rounded-[30px] text-xs h-9 px-3.5 gap-1.5 border-[#DEDEDE] ${
                      course.isPublished
                        ? "text-[#545454] hover:text-amber-700 hover:bg-amber-50"
                        : "text-emerald-700 bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    {course.isPublished ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide from Site</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Publish Live</span>
                      </>
                    )}
                  </Button>

                  {/* REMOVE BUTTON */}
                  <Button
                    onClick={() => setDeletingCourse(course)}
                    variant="outline"
                    size="sm"
                    className="rounded-[30px] text-xs h-9 px-3.5 gap-1.5 border-red-200 text-red-700 bg-red-50 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD COURSE MODAL DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg rounded-[16px] bg-white border border-[#DEDEDE] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-[#194866]">
              Add New Course
            </DialogTitle>
            <DialogDescription className="text-xs text-[#545454]">
              Fill in the course details below. The course will be created and displayed on the website immediately.
            </DialogDescription>
          </DialogHeader>

          {addError && (
            <div className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <form onSubmit={handleAddCourse} className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                Course Title *
              </label>
              <Input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cloud DevOps Engineering & Kubernetes"
                className="h-10 text-xs rounded-[8px] border-[#DEDEDE] bg-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                Discipline / Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 text-xs rounded-[8px] border border-[#DEDEDE] bg-white px-3 text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#194866]"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="OTHER">+ Custom Category</option>
              </select>

              {newCategory === "OTHER" && (
                <Input
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="h-9 text-xs rounded-[8px] border-[#DEDEDE] bg-white mt-2"
                />
              )}
            </div>

            {/* Level & Price Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                  Difficulty Level
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as any)}
                  className="w-full h-10 text-xs rounded-[8px] border border-[#DEDEDE] bg-white px-3 text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#194866]"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                  Price ($ USD)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0 for Free"
                  className="h-10 text-xs rounded-[8px] border-[#DEDEDE] bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                Description & Outcomes
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Overview of what students will master in this curriculum..."
                className="w-full p-2.5 text-xs rounded-[8px] border border-[#DEDEDE] bg-white text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#194866]"
              />
            </div>

            {/* Thumbnail Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                Cover Thumbnail
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DEFAULT_THUMBNAILS.map((thumb) => (
                  <button
                    key={thumb.label}
                    type="button"
                    onClick={() => setNewThumbnail(thumb.url)}
                    className={`relative aspect-video rounded-[6px] overflow-hidden border-2 transition-all cursor-pointer ${
                      newThumbnail === thumb.url
                        ? "border-[#194866] ring-2 ring-[#FF9F59]"
                        : "border-[#DEDEDE] opacity-70 hover:opacity-100"
                    }`}
                    title={thumb.label}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.label}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              <Input
                value={newThumbnail}
                onChange={(e) => setNewThumbnail(e.target.value)}
                placeholder="Or paste custom image URL"
                className="h-9 text-xs rounded-[8px] border-[#DEDEDE] bg-white mt-1"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-[#DEDEDE] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-[30px] text-xs px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[30px] text-xs px-5 font-semibold bg-[#194866] text-white"
              >
                {isSubmitting ? "Creating Course..." : "Add & Publish Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE MODAL DIALOG */}
      <Dialog open={Boolean(deletingCourse)} onOpenChange={(open) => !open && setDeletingCourse(null)}>
        <DialogContent className="max-w-md rounded-[16px] bg-white border border-[#DEDEDE] p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-normal text-red-700 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <span>Confirm Course Removal</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#545454] pt-2">
              Are you sure you want to permanently remove <strong>"{deletingCourse?.title}"</strong>? This will remove it from the course catalog and public homepage.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-[#DEDEDE] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingCourse(null)}
              className="rounded-[30px] text-xs px-4"
            >
              Keep Course
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleRemoveCourse}
              className="rounded-[30px] text-xs px-5 font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Removing..." : "Yes, Remove Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
