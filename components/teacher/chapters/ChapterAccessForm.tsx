"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Loader2, X, Eye } from "lucide-react";

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

export function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFree, setIsFree] = useState(initialData.isFree);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFree }),
      });

      if (!res.ok) {
        throw new Error("Failed to update access settings");
      }

      toast.success("Access settings updated!");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Chapter Access & Preview</span>
          <Button
            onClick={() => setIsEditing((prev) => !prev)}
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs gap-1.5 h-8 px-2.5 text-muted-foreground hover:text-foreground"
          >
            {isEditing ? (
              <>
                <X className="h-3.5 w-3.5" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                Edit access
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          <p className="text-sm font-medium text-foreground">
            {initialData.isFree ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                This chapter is free for preview by any visitor.
              </span>
            ) : (
              <span className="text-muted-foreground">
                This chapter requires active enrollment to access.
              </span>
            )}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-y-0 rounded-xl border p-4 bg-muted/20">
              <input
                type="checkbox"
                id="isFree"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="isFree"
                  className="text-sm font-semibold cursor-pointer text-foreground"
                >
                  Allow Free Preview
                </label>
                <p className="text-xs text-muted-foreground">
                  Check this box if you want this chapter to be publicly accessible for prospective students without enrollment.
                </p>
              </div>
            </div>

            <Button
              onClick={onSubmit}
              disabled={isLoading}
              size="sm"
              className="rounded-xl gap-1.5 font-medium"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Access
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
