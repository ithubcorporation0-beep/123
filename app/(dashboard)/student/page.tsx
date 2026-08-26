import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.name || "Student"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your course progress, upcoming assignments, and earned certificates.
          </p>
        </div>
        <Link href="/courses">
          <Button className="gap-2 rounded-xl">
            <Sparkles className="h-4 w-4" />
            Explore Courses
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Active courses in progress</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Total lessons completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Certificates Earned</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Verified course credentials</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Continue Learning</h2>
        <div className="py-10 text-center flex flex-col items-center justify-center border rounded-xl border-dashed">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="font-semibold text-sm">No courses in progress yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Browse our course catalog to find a course, enroll in one click, and begin tracking your progress.
          </p>
          <Link href="/courses" className="mt-4">
            <Button size="sm" variant="outline" className="gap-1.5 rounded-xl">
              Browse Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
