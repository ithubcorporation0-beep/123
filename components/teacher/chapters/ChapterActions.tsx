"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Trash2, Loader2, Sparkles, EyeOff } from "lucide-react";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  missingFields?: string[];
}

export function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
  missingFields = [],
}: ChapterActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPublishToggle = async () => {
    try {
      setIsLoading(true);
      const endpoint = isPublished
        ? `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        : `/api/courses/${courseId}/chapters/${chapterId}/publish`;

      const res = await fetch(endpoint, {
        method: "PATCH",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update chapter publication state");
      }

      toast.success(isPublished ? "Chapter unpublished" : "Chapter published!");
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
      const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete chapter");
      }

      toast.success("Chapter deleted successfully");
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const tooltipText = disabled && missingFields.length > 0
    ? `Missing required fields: ${missingFields.join(", ")}`
    : undefined;

  return (
    <div className="flex items-center gap-x-2">
      <div title={tooltipText} className="inline-block">
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
      </div>

      <ConfirmModal
        title="Delete this chapter?"
        description="Are you sure you want to delete this chapter? This action cannot be undone."
        confirmText="Delete Chapter"
        onConfirm={onDelete}
        disabled={isLoading}
      >
        <Button
          size="sm"
          variant="destructive"
          disabled={isLoading}
          className="rounded-xl text-xs h-9 w-9 p-0"
          aria-label="Delete chapter"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
