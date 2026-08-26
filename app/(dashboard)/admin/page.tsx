import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderTree, ShieldAlert, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const [userCount, courseCount, categoryCount] = await Promise.all([
    db.profile.count(),
    db.course.count(),
    db.courseCategory.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Platform Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          System-wide oversight, user management, course moderation, and category configuration.
        </p>
      </div>

      {/* Admin Stats from real database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total profiles in database</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courseCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide courses</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active course subjects</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Issued Certificates</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Verified credentials</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="rounded-2xl border shadow-sm p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-primary" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-base">User Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Assign roles (Admin, Instructor, Student) and manage accounts.</p>
          </Card>
        </Link>

        <Link href="/admin/courses">
          <Card className="rounded-2xl border shadow-sm p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-base">Course Moderation</h3>
            <p className="text-xs text-muted-foreground mt-1">Review published courses, check curriculum quality and media.</p>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="rounded-2xl border shadow-sm p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <FolderTree className="h-6 w-6 text-primary" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-base">Category Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Create, edit, and organize taxonomy for courses.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
