"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil, Loader2, X } from "lucide-react";

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
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
        throw new Error("Failed to update chapter description");
      }

      toast.success("Chapter description updated!");
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
          <span>Chapter Description</span>
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
                Edit description
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          <p className={`text-sm leading-relaxed ${!initialData.description ? "text-muted-foreground italic" : "text-foreground"}`}>
            {initialData.description || "No description provided yet."}
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="e.g. 'In this lesson, you will learn...'"
                        rows={4}
                        className="rounded-xl resize-none"
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
