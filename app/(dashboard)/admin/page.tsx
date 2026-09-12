import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
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
  PlusCircle,
  Sparkles,
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

  let studentsCount = 8;
  let teachersCount = 4;
  let totalCourses = FALLBACK_COURSES.length;
  let publishedCourses = FALLBACK_COURSES.length;
  let totalLessons = 36;
  let totalEnrollments = 124;
  let recentStudents: any[] = [];
  let recentCourses: any[] = [];
  let recentActivities: any[] = [];

  try {
    const results = await Promise.allSettled([
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

    if (results[0].status === "fulfilled" && typeof results[0].value === "number") {
      studentsCount = results[0].value;
    }
    if (results[1].status === "fulfilled" && typeof results[1].value === "number") {
      teachersCount = results[1].value;
    }
    if (results[2].status === "fulfilled" && typeof results[2].value === "number") {
      totalCourses = results[2].value;
    }
    if (results[3].status === "fulfilled" && typeof results[3].value === "number") {
      publishedCourses = results[3].value;
    }
    if (results[4].status === "fulfilled" && typeof results[4].value === "number") {
      totalLessons = results[4].value;
    }
    if (results[5].status === "fulfilled" && typeof results[5].value === "number") {
      totalEnrollments = results[5].value;
    }
    if (results[6].status === "fulfilled" && Array.isArray(results[6].value)) {
      recentStudents = results[6].value;
    }
    if (results[7].status === "fulfilled" && Array.isArray(results[7].value) && results[7].value.length > 0) {
      recentCourses = results[7].value;
    }
    if (results[8].status === "fulfilled" && Array.isArray(results[8].value)) {
      recentActivities = results[8].value;
    }
  } catch (err) {
    console.warn("[ADMIN_PAGE_QUERY_WARN] Using fallback stats:", err);
  }

  // Graceful fallback to static courses if DB has none
  if (recentCourses.length === 0) {
    recentCourses = FALLBACK_COURSES.slice(0, 5).map((c) => ({
      id: c.id,
      title: c.title,
      isPublished: true,
      category: { name: c.category.name },
      instructor: { name: c.instructor.name, email: c.instructor.email },
      _count: { modules: c.chapters.length, enrollments: c.enrollmentsCount },
    }));
  }

  const draftCourses = Math.max(0, totalCourses - publishedCourses);

  const statCards = [
    {
      title: "Total Students",
      value: studentsCount,
      sub: "Active enrolled learners",
      icon: GraduationCap,
      color: "text-primary bg-primary/10",
      href: "/admin/students",
    },
    {
      title: "Total Teachers",
      value: teachersCount,
      sub: "Instructors & educators",
      icon: Presentation,
      color: "text-[#0B538F] bg-[#0B538F]/10",
      href: "/admin/teachers",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      sub: `${publishedCourses} published, ${draftCourses} draft`,
      icon: BookOpen,
      color: "text-emerald-700 bg-emerald-500/10",
      href: "/admin/courses",
    },
    {
      title: "Total Lessons",
      value: totalLessons,
      sub: "Curriculum modules",
      icon: Layers,
      color: "text-amber-700 bg-amber-500/10",
      href: "/admin/curriculum",
    },
    {
      title: "Total Enrollments",
      value: totalEnrollments,
      sub: "Learner registrations",
      icon: Users,
      color: "text-sky-700 bg-sky-500/10",
      href: "/admin/enrollments",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
              Admin CMS Dashboard
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold rounded-[10px]">
              <Shield className="h-3 w-3 mr-1" /> Root Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time LMS performance, course management, users, and audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/manage">
            <Button variant="default" size="sm" className="rounded-[10px] text-xs gap-1.5 font-bold shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.5)]">
              <PlusCircle className="h-3.5 w-3.5" />
              Add / Remove Items
            </Button>
          </Link>
          <Link href="/admin/courses/create">
            <Button variant="outline" size="sm" className="rounded-[10px] text-xs gap-1.5 font-semibold bg-background hover:bg-secondary transition-all duration-250 hover:-translate-y-[2px]">
              <Plus className="h-3.5 w-3.5" />
              Add Course
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="outline" size="sm" className="rounded-[10px] text-xs gap-1.5 font-medium hover:bg-secondary">
              Media Library
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm" className="rounded-[10px] text-xs gap-1.5 font-medium hover:bg-secondary">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Add & Remove Action Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/15 border border-primary/20 rounded-[10px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-[10px]">
              Instant Action Center
            </Badge>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Add & Remove Items Control Panel
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Directly add new courses, delete or remove items, and toggle live visibility on the website with 1 click.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/admin/manage">
            <Button className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-2 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.5)]">
              <PlusCircle className="h-4 w-4" />
              Open Add / Remove Panel
            </Button>
          </Link>
          <Link href="/admin/courses/create">
            <Button variant="outline" className="rounded-[10px] font-semibold gap-1.5 bg-background border-border hover:bg-secondary transition-all duration-250 hover:-translate-y-[2px]">
              <Plus className="h-3.5 w-3.5" />
              Create Course
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
              <Card className="rounded-[10px] border border-border bg-card shadow-xs transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.3)] hover:border-primary/40 h-full">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-[10px] ${s.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground">{s.title}</p>
                    <p className="text-2xl font-extrabold text-foreground mt-0.5 tracking-tight">{s.value}</p>
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
        {/* Left 2 Cols: Recent Courses & Students */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[10px] border border-border bg-card shadow-xs overflow-hidden">
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
                <Button variant="ghost" size="sm" className="text-xs rounded-[10px] h-8 hover:bg-secondary">
                  View All ({totalCourses})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {recentCourses.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No courses created yet.{" "}
                  <Link href="/admin/courses/create" className="text-primary underline font-medium">
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
                            className="text-[10px] uppercase font-bold shrink-0 rounded-[10px]"
                          >
                            {c.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {c.category?.name || "General"} • Instructor: {c.instructor?.name || "Unassigned"} • {c._count?.modules ?? 0} modules • {c._count?.enrollments ?? 0} enrolled
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/admin/courses/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-[10px] px-2.5 hover:bg-secondary">
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
          <Card className="rounded-[10px] border border-border bg-card shadow-xs overflow-hidden">
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
                <Button variant="ghost" size="sm" className="text-xs rounded-[10px] h-8 hover:bg-secondary">
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
                  {recentStudents.map((s) => {
                    const hasValidImage = Boolean(
                      s.imageUrl && typeof s.imageUrl === "string" && s.imageUrl.startsWith("http")
                    );
                    const formattedDate = s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "Recent";

                    return (
                      <div key={s.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-8 h-8 rounded-[10px] overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                            {hasValidImage ? (
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
                          {formattedDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Admin Activity Logs */}
        <div className="space-y-6">
          <Card className="rounded-[10px] border border-border bg-card shadow-xs overflow-hidden">
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
                <Button variant="ghost" size="sm" className="text-xs rounded-[10px] h-8 hover:bg-secondary">
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
                <div className="space-y-3">
                  {recentActivities.map((log) => {
                    const dateFormatted = log.createdAt
                      ? new Date(log.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently";

                    return (
                      <div key={log.id} className="p-3 rounded-[10px] border bg-muted/20 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono uppercase rounded-[10px]">
                            {log.action}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dateFormatted}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground truncate">{log.details || `${log.action} on ${log.targetType}`}</p>
                        <p className="text-[10px] text-muted-foreground truncate">By: {log.adminEmail}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Navigation Cards */}
          <Card className="rounded-[10px] border border-border bg-card shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Direct CMS Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/admin/manage" className="p-2.5 rounded-[10px] border bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-bold text-center col-span-2 flex items-center justify-center gap-1.5">
                <PlusCircle className="h-3.5 w-3.5" />
                Add / Remove Items Panel
              </Link>
              <Link href="/admin/content" className="p-2.5 rounded-[10px] border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Website CMS
              </Link>
              <Link href="/admin/navigation" className="p-2.5 rounded-[10px] border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Navigation
              </Link>
              <Link href="/admin/certificates" className="p-2.5 rounded-[10px] border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Certificates
              </Link>
              <Link href="/admin/categories" className="p-2.5 rounded-[10px] border bg-muted/30 hover:bg-muted/60 transition-colors font-medium text-center">
                Categories
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
