"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, Loader2, Sparkles } from "lucide-react";

interface CourseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export function CourseCompleteModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: CourseCompleteModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClaimCertificate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate certificate");
      }

      toast.success("Certificate issued successfully! 🎓");
      onClose();
      router.push("/student/certificates");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 text-center bg-card">
        <DialogHeader className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <GraduationCap className="h-9 w-9 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            You finished the course! 🎉
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Congratulations on completing <strong className="text-foreground font-semibold">{courseTitle}</strong>! You have earned your verifiable certificate.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6 space-y-2">
          <Button
            onClick={onClaimCertificate}
            disabled={isLoading}
            size="lg"
            className="w-full rounded-2xl gap-2 font-bold text-sm shadow-md"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Award className="h-4 w-4" />
                Get My Certificate
              </>
            )}
          </Button>

          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground"
          >
            Review Lessons
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
