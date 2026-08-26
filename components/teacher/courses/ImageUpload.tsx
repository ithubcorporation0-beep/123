"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Loader2, ImageIcon, RefreshCw, X } from "lucide-react";

interface ImageUploadProps {
  initialData: {
    thumbnail: string | null;
  };
  courseId: string;
}

export function ImageUpload({ initialData, courseId }: ImageUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

      // Step 1: Upload to Cloudinary via server route
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

      toast.success("Course image uploaded successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
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
          <span>Course Image</span>
          <Button
            onClick={() => setIsEditing((prev) => !prev)}
            variant="ghost"
            size="sm"
            disabled={isUploading}
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
                Change image
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                Upload image
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          !initialData.thumbnail ? (
            <div className="flex flex-col items-center justify-center h-48 bg-muted/40 rounded-xl border border-dashed text-center p-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">No image uploaded</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                16:9 aspect ratio recommended. Click 'Upload image' to add a course thumbnail.
              </p>
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm group">
              <Image
                src={initialData.thumbnail}
                alt="Course thumbnail"
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>
          )
        )}

        {isEditing && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center h-52 rounded-xl border-2 border-dashed transition-colors cursor-pointer text-center p-6 ${
              isDragging
                ? "border-primary bg-primary/5"
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
                  Uploading to Cloudinary...
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
        )}
      </CardContent>
    </Card>
  );
}
