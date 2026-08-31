"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, PlayCircle, Sparkles } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  firstChapterId?: string | null;
  nextChapterId?: string | null;
  isSignedIn: boolean;
}

export function EnrollButton({
  courseId,
  isEnrolled,
  firstChapterId,
  nextChapterId,
  isSignedIn,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const targetChapterId = nextChapterId || firstChapterId || "ch_1";

  const onEnroll = async () => {
    if (!isSignedIn) {
      router.push(`/login?redirect_url=/courses/${courseId}`);
      return;
    }

    if (isEnrolled) {
      if (targetChapterId) {
        router.push(`/student/learn/${courseId}/${targetChapterId}`);
      } else {
        router.push(`/student/my-courses`);
      }
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already enrolled") {
          toast.info("You are already enrolled in this course!");
          const dest = data.firstChapterId || targetChapterId;
          if (dest) {
            router.push(`/student/learn/${courseId}/${dest}`);
          }
          return;
        }
        // If DB enrollment fails gracefully in preview mode, let student preview directly
        toast.info("Enrolling in course preview...");
        router.push(`/student/learn/${courseId}/${targetChapterId}`);
        return;
      }

      toast.success("Enrolled successfully! 🎉 Welcome to the course.");
      const chapterDest = data.firstChapterId || targetChapterId;
      if (chapterDest) {
        router.push(`/student/learn/${courseId}/${chapterDest}`);
      } else {
        router.push(`/student/my-courses`);
      }
      router.refresh();
    } catch (error: any) {
      // Fallback navigation so user is never blocked
      router.push(`/student/learn/${courseId}/${targetChapterId}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        onClick={onEnroll}
        disabled={isLoading}
        size="lg"
        variant="default"
        className="w-full h-13 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 text-sm gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <PlayCircle className="h-4.5 w-4.5" />
            Continue Learning
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={onEnroll}
      disabled={isLoading}
      size="lg"
      className="w-full h-13 rounded-2xl font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 text-sm gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span>Enroll Free & Start Learning</span>
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
