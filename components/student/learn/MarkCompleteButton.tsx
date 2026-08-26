"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";

interface MarkCompleteButtonProps {
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
  nextChapterId?: string | null;
  prevChapterId?: string | null;
}

export function MarkCompleteButton({
  courseId,
  chapterId,
  isCompleted: initialCompleted,
  nextChapterId,
  prevChapterId,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const toggleComplete = async () => {
    try {
      setIsLoading(true);
      const newStatus = !isCompleted;

      const res = await fetch(`/api/progress/${chapterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update chapter progress");
      }

      setIsCompleted(newStatus);

      if (newStatus) {
        toast.success("Chapter completed! 🎉");
        if (nextChapterId) {
          router.push(`/student/learn/${courseId}/${nextChapterId}`);
        }
      } else {
        toast.info("Chapter marked as incomplete");
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      {/* Previous Chapter Button */}
      {prevChapterId ? (
        <Link href={`/student/learn/${courseId}/${prevChapterId}`}>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-medium">
            <ChevronLeft className="h-4 w-4" />
            Previous Chapter
          </Button>
        </Link>
      ) : (
        <div />
      )}

      {/* Center / Action: Mark Complete / Incomplete */}
      <Button
        onClick={toggleComplete}
        disabled={isLoading}
        variant={isCompleted ? "secondary" : "default"}
        size="sm"
        className="rounded-xl gap-2 text-xs font-bold shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isCompleted ? (
          <>
            <RotateCcw className="h-3.5 w-3.5" />
            Mark Incomplete
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mark as Completed
          </>
        )}
      </Button>

      {/* Next Chapter Button */}
      {nextChapterId ? (
        <Link href={`/student/learn/${courseId}/${nextChapterId}`}>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-medium">
            Next Chapter
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
