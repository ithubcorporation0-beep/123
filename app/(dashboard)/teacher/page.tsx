import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation, Users, BarChart3, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Instructor Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your courses, track enrolled student performance, and view revenue analytics.
          </p>
        </div>
        <Link href="/teacher/courses">
          <Button className="gap-2 rounded-xl">
            <PlusCircle className="h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">My Courses</CardTitle>
            <Presentation className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Published & draft courses</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled across all courses</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Average student progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses List Container */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Courses</h2>
          <Link href="/teacher/courses">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </Link>
        </div>

        <div className="py-10 text-center flex flex-col items-center justify-center border rounded-xl border-dashed">
          <Presentation className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="font-semibold text-sm">No courses created yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Start by creating your first course, adding modules, video lectures, and quizzes.
          </p>
          <Link href="/teacher/courses" className="mt-4">
            <Button size="sm" className="gap-1.5 rounded-xl">
              <PlusCircle className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
