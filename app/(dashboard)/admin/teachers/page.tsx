import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeacherManagementView, TeacherRecord } from "@/components/admin/teachers/TeacherManagementView";
import { Badge } from "@/components/ui/badge";
import { Presentation } from "lucide-react";

export default async function AdminTeachersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const teachers = await db.profile.findMany({
    where: { role: "instructor" },
    include: {
      coursesCreated: {
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
          price: true,
        },
      },
      _count: {
        select: { coursesCreated: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted: TeacherRecord[] = teachers.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    phone: t.phone,
    bio: t.bio,
    imageUrl: t.imageUrl,
    status: t.status,
    createdAt: t.createdAt,
    coursesCreated: t.coursesCreated,
    _count: t._count,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Teacher Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Presentation className="h-3.5 w-3.5 mr-1" /> Instructors CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Appoint new instructors, configure teacher biographies and avatars, assign courses, and monitor published catalogs.
        </p>
      </div>

      <TeacherManagementView initialTeachers={formatted} />
    </div>
  );
}
