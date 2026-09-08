"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  UploadCloud,
  Loader2,
  ImageIcon,
  RefreshCw,
  X,
  Trash2,
  Check,
} from "lucide-react";

interface ImageUploadProps {
  initialData: {
    thumbnail: string | null;
  };
  courseId: string;
}

export function ImageUpload({ initialData, courseId }: ImageUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [imageUrlInput, setImageUrlInput] = useState(initialData.thumbnail || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be under 4MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Step 1: Upload via server route (Cloudinary with local fallback)
      const uploadRes = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || "Upload failed");
      }

      const { url } = await uploadRes.json();

      // Step 2: Save to Course record
      const updateRes = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: url }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to save image to course");
      }

      toast.success("Course image updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveUrl = async () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      toast.error("Please enter a valid image URL");
      return;
    }

    try {
      setIsSavingUrl(true);
      const updateRes = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: trimmed }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        throw new Error(err.error || "Failed to save image URL");
      }

      toast.success("Course image URL saved!");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save image URL");
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsDeleting(true);
      const updateRes = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: null }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to remove image");
      }

      toast.success("Course image removed");
      setImageUrlInput("");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to remove image");
    } finally {
      setIsDeleting(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            Course Picture / Thumbnail
          </span>
          <div className="flex items-center gap-1.5">
            {initialData.thumbnail && !isEditing && (
              <Button
                onClick={handleRemoveImage}
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="rounded-xl text-xs gap-1 h-8 px-2.5 text-destructive hover:bg-destructive/10"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Remove
              </Button>
            )}
            <Button
              onClick={() => {
                setIsEditing((prev) => !prev);
                setImageUrlInput(initialData.thumbnail || "");
              }}
              variant="ghost"
              size="sm"
              disabled={isUploading || isSavingUrl || isDeleting}
              className="rounded-xl text-xs gap-1.5 h-8 px-2.5 text-muted-foreground hover:text-foreground"
            >
              {isEditing ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </>
              ) : initialData.thumbnail ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Change
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" />
                  Add image
                </>
              )}
            </Button>
          </div>
        </div>

        {!isEditing && (
          !initialData.thumbnail ? (
            <div className="flex flex-col items-center justify-center h-48 bg-muted/40 rounded-xl border border-dashed text-center p-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">No image uploaded</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                16:9 aspect ratio recommended. Click 'Add image' to upload a file or paste an image URL.
              </p>
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm group bg-muted/20">
              <Image
                src={initialData.thumbnail}
                alt="Course thumbnail"
                fill
                unoptimized
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>
          )
        )}

        {isEditing && (
          <div className="space-y-4 animate-scale-in">
            {/* Tabs */}
            <div className="flex gap-2 border-b pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`text-xs font-medium pb-1 px-2 border-b-2 transition-all ${
                  activeTab === "upload"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`text-xs font-medium pb-1 px-2 border-b-2 transition-all ${
                  activeTab === "url"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Image URL
              </button>
            </div>

            {activeTab === "upload" ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center p-6 ${
                  isDragging
                    ? "border-primary bg-primary/5 animate-pulse-glow"
                    : "border-muted-foreground/30 hover:border-primary/50 bg-muted/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileSelect}
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-foreground">
                      Uploading image...
                    </p>
                    <p className="text-xs text-muted-foreground">Please wait a moment</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PNG, JPG, WEBP, or GIF (max 4MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="rounded-xl h-10 text-xs"
                    disabled={isSavingUrl}
                  />
                  <Button
                    onClick={handleSaveUrl}
                    disabled={isSavingUrl || !imageUrlInput.trim()}
                    className="rounded-xl h-10 px-4 text-xs gap-1.5 shrink-0"
                  >
                    {isSavingUrl ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Save URL
                  </Button>
                </div>
                {imageUrlInput.trim() && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted/30">
                    <Image
                      src={imageUrlInput.trim()}
                      alt="URL Preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => toast.error("Could not load image from the provided URL")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
