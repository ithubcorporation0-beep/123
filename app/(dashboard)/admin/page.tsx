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
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  User,
  Shield,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
  }

  const [
    totalUsers,
    studentsCount,
    instructorsCount,
    adminsCount,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
    newestUsers,
  ] = await Promise.all([
    db.profile.count(),
    db.profile.count({ where: { role: "student" } }),
    db.profile.count({ where: { role: "instructor" } }),
    db.profile.count({ where: { role: "admin" } }),
    db.course.count(),
    db.course.count({ where: { isPublished: true } }),
    db.enrollment.count(),
    db.certificate.count(),
    db.profile.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const metrics = [
    {
      title: "Total Learners",
      value: studentsCount,
      description: `${studentsCount} registered students`,
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Instructors",
      value: instructorsCount,
      description: `${instructorsCount} verified authors`,
      icon: Users,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      description: `${publishedCourses} published live`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Certificates Issued",
      value: totalCertificates,
      description: `${totalEnrollments} total enrollments`,
      icon: Award,
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Platform Administration
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
              <Shield className="h-3 w-3 mr-1" /> Root Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Global system analytics, user management, course moderation, and category taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs gap-1.5 font-medium">
              <Users className="h-3.5 w-3.5" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button variant="default" size="sm" className="rounded-2xl text-xs gap-1.5 font-bold shadow-xs">
              <BookOpen className="h-3.5 w-3.5" />
              Manage Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="rounded-3xl border bg-card shadow-xs">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl shrink-0 ${m.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{m.title}</p>
                  <p className="text-2xl font-extrabold text-foreground mt-0.5">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Newest Platform Signups */}
      <Card className="rounded-3xl border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Newest Signups</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recently registered accounts across the platform
            </p>
          </div>

          <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1 h-8">
              View All {totalUsers} Users
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="divide-y divide-border/60">
            {newestUsers.map((user) => {
              const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={user.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                      {user.imageUrl ? (
                        <Image src={user.imageUrl} alt={user.name || "User"} fill className="object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{user.name || "Unnamed User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "instructor" ? "secondary" : "outline"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">{formattedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
