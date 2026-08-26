"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2, X } from "lucide-react";
import { ChapterList } from "@/components/teacher/courses/ChapterList";

interface ChapterFormProps {
  initialData: {
    chapters: any[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Chapter title is required").max(150),
});

export function ChapterForm({ initialData, courseId }: ChapterFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create chapter");
      }

      toast.success("Chapter created!");
      form.reset();
      setIsCreating(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/courses/${courseId}/chapters/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: updateData }),
      });

      if (!res.ok) {
        throw new Error("Failed to reorder chapters");
      }

      toast.success("Chapters reordered!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Course Chapters</span>
          <Button
            onClick={() => setIsCreating((prev) => !prev)}
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs gap-1.5 h-8 px-2.5 text-muted-foreground hover:text-foreground"
          >
            {isCreating ? (
              <>
                <X className="h-3.5 w-3.5" />
                Cancel
              </>
            ) : (
              <>
                <PlusCircle className="h-3.5 w-3.5" />
                Add a chapter
              </>
            )}
          </Button>
        </div>

        {isCreating && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to Server Components'"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="rounded-xl gap-1.5 font-medium"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Chapter
              </Button>
            </form>
          </Form>
        )}

        {!isCreating && (
          <div className="text-sm">
            {initialData.chapters.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">
                No chapters created yet. Click &apos;Add a chapter&apos; to begin.
              </p>
            ) : (
              <ChapterList
                onEdit={onEdit}
                onReorder={onReorder}
                items={initialData.chapters || []}
                courseId={courseId}
              />
            )}
          </div>
        )}

        {!isCreating && initialData.chapters.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Drag and drop to reorder the chapters
          </p>
        )}
      </CardContent>
    </Card>
  );
}
