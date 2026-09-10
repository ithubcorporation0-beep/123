import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentManagementView, StudentRecord } from "@/components/admin/students/StudentManagementView";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

export default async function AdminStudentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const students = await db.profile.findMany({
    where: { role: "student" },
    include: {
      enrollments: {
        include: {
          course: {
            select: { id: true, title: true, slug: true, thumbnail: true },
          },
        },
      },
      certificates: {
        include: {
          course: { select: { title: true } },
        },
      },
      _count: {
        select: { enrollments: true, certificates: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted: StudentRecord[] = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    bio: s.bio,
    imageUrl: s.imageUrl,
    status: s.status,
    createdAt: s.createdAt,
    enrollments: s.enrollments,
    certificates: s.certificates,
    _count: s._count,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Student Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <GraduationCap className="h-3.5 w-3.5 mr-1" /> Learners CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor learner accounts, verify enrollment status, inspect certificates, and manage account privileges.
        </p>
      </div>

      <StudentManagementView initialStudents={formatted} />
    </div>
  );
}
