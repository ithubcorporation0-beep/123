import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  ArrowRight,
  User,
  Shield,
  Presentation,
  LayoutDashboard,
  Layers,
  Activity,
  Plus,
  FolderTree,
  FileCheck2,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default async function AdminOverviewPage() {
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

  const [
    studentsCount,
    teachersCount,
    totalCourses,
    publishedCourses,
    totalLessons,
    totalEnrollments,
    recentStudents,
    recentCourses,
    recentActivities,
  ] = await Promise.all([
    db.profile.count({ where: { role: "student" } }),
    db.profile.count({ where: { role: "instructor" } }),
    db.course.count(),
    db.course.count({ where: { isPublished: true } }),
    db.lesson.count(),
    db.enrollment.count(),
    db.profile.findMany({
      where: { role: "student" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        instructor: { select: { name: true, email: true } },
        category: { select: { name: true } },
        _count: { select: { modules: true, enrollments: true } },
      },
    }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const draftCourses = totalCourses - publishedCourses;

  const statCards = [
    {
      title: "Total Students",
      value: studentsCount,
      sub: "Active enrolled learners",
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-500/10",
      href: "/admin/students",
    },
    {
      title: "Total Teachers",
      value: teachersCount,
      sub: "Instructors & creators",
      icon: Presentation,
      color: "text-purple-600 bg-purple-500/10",
      href: "/admin/teachers",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      sub: `${publishedCourses} published, ${draftCourses} draft`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-500/10",
      href: "/admin/courses",
    },
    {
      title: "Total Lessons",
      value: totalLessons,
      sub: "Curriculum units",
      icon: Layers,
      color: "text-amber-600 bg-amber-500/10",
      href: "/admin/curriculum",
    },
    {
      title: "Total Enrollments",
      value: totalEnrollments,
      sub: "Course registrations",
      icon: Users,
      color: "text-indigo-600 bg-indigo-500/10",
      href: "/admin/enrollments",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-serif">
              Admin CMS Dashboard
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
              <Shield className="h-3 w-3 mr-1" /> Root Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time LMS performance, course management, users, and audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/courses/create">
            <Button variant="default" size="sm" className="rounded-2xl text-xs gap-1.5 font-bold shadow-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Course
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs gap-1.5 font-medium">
              Media Library
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs gap-1.5 font-medium">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.title} href={s.href} className="group">
              <Card className="rounded-2xl border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-sm h-full">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${s.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground">{s.title}</p>
                    <p className="text-2xl font-extrabold text-foreground mt-0.5">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{s.sub}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main 2-column Grid: Recent Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Recent Courses</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest course additions with publication status and enrollment stats
                </p>
              </div>
              <Link href="/admin/courses">
                <Button variant="ghost" size="sm" className="text-xs rounded-xl h-8">
                  View All ({totalCourses})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {recentCourses.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No courses created yet.{" "}
                  <Link href="/admin/courses/create" className="text-primary underline">
                    Create the first course.
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentCourses.map((c) => (
                    <div key={c.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/courses/${c.id}`}
                            className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate"
                          >
                            {c.title}
                          </Link>
                          <Badge
                            variant={c.isPublished ? "default" : "secondary"}
                            className="text-[10px] uppercase font-bold shrink-0"
                          >
                            {c.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {c.category?.name || "General"} • Instructor: {c.instructor?.name || "Unassigned"} • {c._count.modules} modules • {c._count.enrollments} enrolled
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/admin/courses/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg px-2.5">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Recent Students</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Newly joined student learners
                </p>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-xs rounded-xl h-8">
                  View All ({studentsCount})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {recentStudents.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No registered students yet.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentStudents.map((s) => (
                    <div key={s.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                          {s.imageUrl ? (
                            <Image src={s.imageUrl} alt={s.name || "Student"} fill unoptimized className="object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{s.name || "Unnamed Student"}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Admin Activity Logs */}
        <div className="space-y-6">
          <Card className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Audit trail of actions
                </p>
              </div>
              <Link href="/admin/activity">
                <Button variant="ghost" size="sm" className="text-xs rounded-xl h-8">
                  All Logs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {recentActivities.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                  <p>No activity records logged yet.</p>
                  <p className="text-[11px] text-muted-foreground/70">
                    System operations and content modifications will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentActivities.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl border bg-muted/20 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">
                          {log.action}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground truncate">{log.details || `${log.action} on ${log.targetType}`}</p>
                      <p className="text-[10px] text-muted-foreground truncate">By: {log.adminEmail}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Navigation Cards */}
          <Card className="rounded-2xl border bg-card shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Direct CMS Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/admin/content" className="p-2.5 rounded-xl border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Website CMS
              </Link>
              <Link href="/admin/navigation" className="p-2.5 rounded-xl border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Navigation
              </Link>
              <Link href="/admin/certificates" className="p-2.5 rounded-xl border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Certificates
              </Link>
              <Link href="/admin/categories" className="p-2.5 rounded-xl border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Categories
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

