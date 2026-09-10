"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  Layers,
  Trash2,
  Video,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  Loader2,
  ExternalLink,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

interface InstructorOption {
  id: string;
  name: string | null;
  email: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface AdminCourseEditorProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    bannerUrl: string | null;
    introVideoUrl: string | null;
    duration: string | null;
    level: string | null;
    price: number;
    status: string;
    isPublished: boolean;
    isFeatured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    instructorId: string;
    categoryId: string | null;
    instructor?: { name: string | null; email: string } | null;
    category?: { name: string } | null;
    _count?: { modules: number; enrollments: number };
  };
  instructors: InstructorOption[];
  categories: CategoryOption[];
}

export function AdminCourseEditor({
  course,
  instructors,
  categories,
}: AdminCourseEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [categoryId, setCategoryId] = useState(course.categoryId || "");
  const [instructorId, setInstructorId] = useState(course.instructorId || "");
  const [thumbnail, setThumbnail] = useState(course.thumbnail || "");
  const [bannerUrl, setBannerUrl] = useState(course.bannerUrl || "");
  const [introVideoUrl, setIntroVideoUrl] = useState(course.introVideoUrl || "");
  const [level, setLevel] = useState(course.level || "BEGINNER");
  const [duration, setDuration] = useState(course.duration || "");
  const [price, setPrice] = useState(course.price?.toString() || "0");
  const [status, setStatus] = useState(course.status || (course.isPublished ? "PUBLISHED" : "DRAFT"));
  const [isFeatured, setIsFeatured] = useState(course.isFeatured || false);
  const [seoTitle, setSeoTitle] = useState(course.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(course.seoDescription || "");

  // Upload handler helper
  const handleUpload = async (file: File, fieldName: "thumbnail" | "bannerUrl" | "introVideoUrl", type: "image" | "video") => {
    try {
      setUploadingField(fieldName);
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
      if (fieldName === "thumbnail") setThumbnail(data.url);
      if (fieldName === "bannerUrl") setBannerUrl(data.url);
      if (fieldName === "introVideoUrl") setIntroVideoUrl(data.url);

      toast.success(`${fieldName} updated! Save course to persist changes.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploadingField(null);
    }
  };

  // Save all changes
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId: categoryId || null,
          instructorId,
          thumbnail,
          bannerUrl,
          introVideoUrl,
          level,
          duration,
          price: parseFloat(price) || 0,
          status,
          isPublished: status === "PUBLISHED",
          isFeatured,
          seoTitle,
          seoDescription,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save course");
      }

      toast.success("Course details saved successfully! ✨");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete course");

      toast.success("Course deleted successfully");
      router.push("/admin/courses");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border shadow-xs">
        <div className="flex items-center gap-2">
          <Badge variant={status === "PUBLISHED" ? "default" : "secondary"} className="uppercase text-xs font-bold">
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            Slug: /{course.slug}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${course.id}/curriculum`}>
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 font-semibold">
              <Layers className="h-3.5 w-3.5" />
              Manage Curriculum ({course._count?.modules || 0})
            </Button>
          </Link>
          <Link href={`/courses/${course.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Public
            </Button>
          </Link>
          <ConfirmModal
            onConfirm={handleDeleteCourse}
            title="Delete Course"
            description={`Are you sure you want to permanently delete "${course.title}"? This will remove all modules, lessons, and enrollment records.`}
          >
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </ConfirmModal>
          <Button onClick={handleSave} disabled={saving} size="sm" className="rounded-xl text-xs gap-1.5 font-bold shadow-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Course
          </Button>
        </div>
      </div>

      {/* Main Grid: 2 Cols Left, 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Media */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Course Info */}
          <Card className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">Basic Information</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Course Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Full Description / Overview</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive course description, what students will learn, prerequisites..."
                rows={6}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Assigned Teacher / Instructor</label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
                >
                  {instructors.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      {ins.name || ins.email} ({ins.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Media: Thumbnail, Banner & Intro Video */}
          <Card className="rounded-2xl border bg-card p-6 space-y-5">
            <h3 className="font-bold text-base text-foreground">Course Media</h3>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Course Thumbnail Image</span>
                {uploadingField === "thumbnail" && (
                  <span className="text-primary text-[11px] flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                  {thumbnail ? (
                    <Image src={thumbnail} alt="Thumbnail preview" fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No thumbnail</span>
                  )}
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <Input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://... or upload image"
                    className="rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "thumbnail", "image");
                        }}
                      />
                      <div className="h-8 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        Upload / Replace Image
                      </div>
                    </label>
                    {thumbnail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setThumbnail("")}
                        className="h-8 text-xs text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="space-y-2 pt-3 border-t">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Header Banner Image (Wide 16:9 or 3:1)</span>
                {uploadingField === "bannerUrl" && (
                  <span className="text-primary text-[11px] flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-full sm:w-48 h-20 rounded-xl overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                  {bannerUrl ? (
                    <Image src={bannerUrl} alt="Banner preview" fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No banner</span>
                  )}
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <Input
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://... or upload banner image"
                    className="rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "bannerUrl", "image");
                        }}
                      />
                      <div className="h-8 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        Upload Banner
                      </div>
                    </label>
                    {bannerUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBannerUrl("")}
                        className="h-8 text-xs text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Intro Video */}
            <div className="space-y-2 pt-3 border-t">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Course Intro / Trailer Video URL</span>
                {uploadingField === "introVideoUrl" && (
                  <span className="text-primary text-[11px] flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={introVideoUrl}
                    onChange={(e) => setIntroVideoUrl(e.target.value)}
                    placeholder="https://... direct video URL, Cloudinary, YouTube or Vimeo"
                    className="rounded-xl text-xs"
                  />
                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, "introVideoUrl", "video");
                      }}
                    />
                    <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors">
                      <Video className="h-3.5 w-3.5" />
                      Upload Video
                    </div>
                  </label>
                </div>
                {introVideoUrl && (
                  <p className="text-[11px] text-emerald-600 truncate font-mono">
                    Active Video: {introVideoUrl}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* SEO Metadata */}
          <Card className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">SEO & Search Visibility</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">SEO Meta Title</label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Meta title for search engines (defaults to course title)"
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">SEO Meta Description</label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description snippet for search engines..."
                rows={3}
                className="rounded-xl text-xs"
              />
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Publishing, Level, Price & Status */}
        <div className="space-y-6">
          {/* Status & Publication Card */}
          <Card className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Publication Status</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm font-semibold"
              >
                <option value="DRAFT">Draft (Unpublished)</option>
                <option value="PUBLISHED">Published (Visible)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Featured on Homepage */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                isFeatured ? "bg-primary/5 border-primary/40" : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div>
                <p className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Featured Course
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Display prominently on the public homepage
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isFeatured ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}
              >
                {isFeatured && <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl text-xs font-bold">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save All Changes
            </Button>
          </Card>

          {/* Pricing & Course Level Card */}
          <Card className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Course Specs</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-bold">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl pl-7 text-sm font-semibold"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Set 0 for free course enrollment</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Course Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Estimated Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 8 hours, 12 weeks"
                className="rounded-xl text-sm"
              />
            </div>
          </Card>

          {/* Curriculum Quick Access */}
          <Card className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              Curriculum Summary
            </h3>
            <p className="text-xs text-muted-foreground">
              This course currently has <strong>{course._count?.modules || 0}</strong> modules and{" "}
              <strong>{course._count?.enrollments || 0}</strong> active students enrolled.
            </p>
            <Link href={`/admin/courses/${course.id}/curriculum`} className="block">
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs gap-1.5 font-semibold">
                Open Curriculum Editor
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
