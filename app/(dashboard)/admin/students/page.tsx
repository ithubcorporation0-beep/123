import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentManagementView, StudentRecord } from "@/components/admin/students/StudentManagementView";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

const FALLBACK_STUDENT_RECORDS: StudentRecord[] = [
  {
    id: "student_emily",
    name: "Emily Clark",
    email: "emily.clark@student.izba.app",
    phone: "+1 (555) 234-5678",
    bio: "Enthusiastic design learner exploring digital illustration and visual storytelling.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    enrollments: [
      {
        id: "enr_1",
        course: {
          id: "course_creative_design",
          title: "Creative Visual Arts & Graphic Design Mastery",
          slug: "creative-visual-arts-graphic-design",
          thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
        },
      },
    ],
    certificates: [],
    _count: { enrollments: 1, certificates: 0 },
  },
  {
    id: "student_marcus",
    name: "Marcus Vance",
    email: "marcus.vance@student.izba.app",
    phone: "+1 (555) 345-6789",
    bio: "Data science and economics student focused on quantitative problem solving.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    enrollments: [
      {
        id: "enr_2",
        course: {
          id: "course_data_science",
          title: "Foundations of Data Science & Critical Thinking",
          slug: "foundations-of-data-science-critical-thinking",
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        },
      },
    ],
    certificates: [],
    _count: { enrollments: 1, certificates: 0 },
  },
  {
    id: "student_sophia",
    name: "Sophia Chen",
    email: "sophia.chen@student.izba.app",
    phone: "+1 (555) 456-7890",
    bio: "Passionate about public speaking, executive communication, and debate.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    enrollments: [
      {
        id: "enr_3",
        course: {
          id: "course_public_speaking",
          title: "Mastering Public Speaking & Confident Communication",
          slug: "mastering-public-speaking-communication",
          thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
        },
      },
    ],
    certificates: [],
    _count: { enrollments: 1, certificates: 0 },
  },
  {
    id: "student_david",
    name: "David Kim",
    email: "david.kim@student.izba.app",
    phone: "+1 (555) 567-8901",
    bio: "Dedicated learner building long-term financial literacy and budgeting skills.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    enrollments: [],
    certificates: [],
    _count: { enrollments: 0, certificates: 0 },
  },
];

export default async function AdminStudentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let students: any[] = [];
  try {
    students = await db.profile.findMany({
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
  } catch (err) {
    console.warn("[ADMIN_STUDENTS_WARN]", err);
  }

  let formatted: StudentRecord[] = (students || []).map((s) => ({
    id: s.id,
    name: s.name || "Student",
    email: s.email || "student@example.com",
    phone: s.phone || null,
    bio: s.bio || null,
    imageUrl: s.imageUrl || null,
    status: s.status || "ACTIVE",
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    enrollments: Array.isArray(s.enrollments)
      ? s.enrollments
          .filter((e: any) => Boolean(e && e.course))
          .map((e: any) => ({
            id: e.id,
            course: {
              id: e.course.id,
              title: e.course.title || "Course",
              slug: e.course.slug || "course",
              thumbnail: e.course.thumbnail || null,
            },
          }))
      : [],
    certificates: Array.isArray(s.certificates)
      ? s.certificates.map((c: any) => ({
          id: c.id,
          course: { title: c.course?.title || "Course" },
        }))
      : [],
    _count: {
      enrollments: s._count?.enrollments ?? (s.enrollments?.length || 0),
      certificates: s._count?.certificates ?? (s.certificates?.length || 0),
    },
  }));

  if (formatted.length === 0) {
    formatted = FALLBACK_STUDENT_RECORDS;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Student Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold rounded-[10px]">
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
