import Link from "next/link";
import { CourseForm } from "@/components/teacher/courses/CourseForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateCoursePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/courses">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Name your course
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a title for your course. Don&apos;t worry, you can edit the title, description, and curriculum anytime.
          </p>
        </div>
      </div>

      <CourseForm />
    </div>
  );
}
