"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Plus, Upload, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AdminCourseCreateFormProps {
  categories: { id: string; name: string }[];
  instructors: { id: string; name: string | null; email: string }[];
}

export function AdminCourseCreateForm({ categories, instructors }: AdminCourseCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || "");
  const [thumbnail, setThumbnail] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("0");
  const [duration, setDuration] = useState("");

  const handleUpload = async (file: File) => {
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
      setThumbnail(data.url);
      toast.success("Thumbnail uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId: categoryId || null,
          instructorId: instructorId || null,
          thumbnail: thumbnail || null,
          level,
          duration: duration || null,
          price: parseFloat(price) || 0,
          status: "DRAFT",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create course");
      }

      const course = await res.json();
      toast.success("Course created successfully!");
      router.push(`/admin/courses/${course.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Course Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced TypeScript and Next.js 15 Masterclass"
              className="rounded-xl text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Overview / Short Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What students will learn in this course..."
              rows={4}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="text-xs font-semibold">Instructor</label>
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

          {/* Thumbnail upload */}
          <div className="space-y-2 p-4 rounded-xl border bg-muted/20">
            <label className="text-xs font-semibold flex items-center justify-between">
              <span>Course Thumbnail</span>
              {uploading && (
                <span className="text-xs text-primary flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading image...
                </span>
              )}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-20 rounded-xl overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                {thumbnail ? (
                  <Image src={thumbnail} alt="Thumbnail preview" fill unoptimized className="object-cover" />
                ) : (
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://... or upload image"
                  className="rounded-xl text-xs"
                />
                <label className="cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                  <div className="h-8 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Thumbnail
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Price (USD)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Level</label>
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
              <label className="text-xs font-semibold">Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 10 hours"
                className="rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Create Course
          </Button>
        </div>
      </form>
    </Card>
  );
}
