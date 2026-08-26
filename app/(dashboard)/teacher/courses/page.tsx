import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation, PlusCircle } from "lucide-react";

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Course Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, edit, and publish your course curriculum, modules, video lectures, and quizzes.
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <PlusCircle className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <Card className="rounded-2xl border shadow-sm p-8 text-center flex flex-col items-center justify-center border-dashed">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3">
          <Presentation className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg">No courses found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          You haven't created any courses yet. Click below to initialize a new course structure.
        </p>
        <Button className="mt-5 gap-2 rounded-xl">
          <PlusCircle className="h-4 w-4" />
          Create Course
        </Button>
      </Card>
    </div>
  );
}
