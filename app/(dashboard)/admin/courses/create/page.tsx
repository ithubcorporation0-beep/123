import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CourseForm } from "@/components/teacher/courses/CourseForm";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminCreateCoursePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    if (currentUser.role === "instructor") {
      redirect("/teacher");
    }
    redirect("/student");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create New Course
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
              <Shield className="h-3 w-3 mr-1" /> Admin Panel
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Give the course an initial title. Once created, you can upload pictures, define pricing, add chapters, and configure all details.
          </p>
        </div>
      </div>

      <CourseForm basePath="/admin" />
    </div>
  );
}
