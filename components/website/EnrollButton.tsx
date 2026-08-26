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

  const targetChapterId = nextChapterId || firstChapterId;

  const onEnroll = async () => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=/courses/${courseId}`);
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
        throw new Error(data.error || "Failed to enroll in course");
      }

      toast.success("You're enrolled 🎉");
      const chapterDest = data.firstChapterId || targetChapterId;
      if (chapterDest) {
        router.push(`/student/learn/${courseId}/${chapterDest}`);
      } else {
        router.push(`/student/my-courses`);
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete enrollment");
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
        className="w-full rounded-2xl font-bold shadow-md text-sm gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <PlayCircle className="h-4 w-4" />
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
      className="w-full rounded-2xl font-bold shadow-md text-sm gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Enroll in Course (Free)
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
