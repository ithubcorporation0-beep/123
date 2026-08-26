"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Trash2, Loader2, Sparkles, EyeOff } from "lucide-react";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export function CourseActions({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPublishToggle = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update publication status");
      }

      toast.success(isPublished ? "Course unpublished" : "Course published!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      router.push("/teacher/courses");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublishToggle}
        disabled={disabled || isLoading}
        variant={isPublished ? "outline" : "default"}
        size="sm"
        className="rounded-xl text-xs gap-1.5 font-medium shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPublished ? (
          <>
            <EyeOff className="h-3.5 w-3.5" />
            Unpublish
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            Publish
          </>
        )}
      </Button>

      <ConfirmModal
        title="Delete this course?"
        description="Are you sure you want to delete this course? All associated modules, lessons, and assignments will be permanently removed."
        confirmText="Delete Course"
        onConfirm={onDelete}
        disabled={isLoading}
      >
        <Button
          size="sm"
          variant="destructive"
          disabled={isLoading}
          className="rounded-xl text-xs h-9 w-9 p-0"
          aria-label="Delete course"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
