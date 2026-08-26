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
import { Pencil, Loader2, X } from "lucide-react";

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
});

export function ChapterTitleForm({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update chapter title");
      }

      toast.success("Chapter title updated!");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Chapter Title</span>
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
                Edit title
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          <p className="text-sm font-medium text-foreground">{initialData.title}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to Course'"
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
                Save
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
