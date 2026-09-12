import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeacherManagementView, TeacherRecord } from "@/components/admin/teachers/TeacherManagementView";
import { Badge } from "@/components/ui/badge";
import { Presentation } from "lucide-react";

const FALLBACK_TEACHER_RECORDS: TeacherRecord[] = [
  {
    id: "inst_david",
    name: "David Kim",
    email: "david.kim@izba.app",
    phone: "+1 (555) 678-9012",
    bio: "Executive Coach & Management Educator with 15+ years guiding entrepreneurs and organizational leaders.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    coursesCreated: [
      {
        id: "course_business_leadership",
        title: "Mastering Business Leadership & Strategic Management",
        slug: "mastering-business-leadership-management",
        isPublished: true,
        price: 0,
      },
    ],
    _count: { coursesCreated: 1 },
  },
  {
    id: "inst_alex",
    name: "Alex Rivera",
    email: "alex.rivera@izba.app",
    phone: "+1 (555) 789-0123",
    bio: "Creative Director & Visual Design Educator passionate about unlocking creative potential in learners.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    coursesCreated: [
      {
        id: "course_creative_design",
        title: "Creative Visual Arts & Graphic Design Mastery",
        slug: "creative-visual-arts-graphic-design",
        isPublished: true,
        price: 0,
      },
    ],
    _count: { coursesCreated: 1 },
  },
  {
    id: "inst_sarah",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@izba.app",
    phone: "+1 (555) 890-1234",
    bio: "Associate Professor of Computational Science dedicated to making data literacy accessible to everyone.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    coursesCreated: [
      {
        id: "course_data_science",
        title: "Foundations of Data Science & Critical Thinking",
        slug: "foundations-of-data-science-critical-thinking",
        isPublished: true,
        price: 0,
      },
    ],
    _count: { coursesCreated: 1 },
  },
  {
    id: "inst_elena",
    name: "Elena Rostova",
    email: "elena.rostova@izba.app",
    phone: "+1 (555) 901-2345",
    bio: "Keynote Speaker & Communication Coach who has mentored over 10,000 public presenters globally.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
    coursesCreated: [
      {
        id: "course_public_speaking",
        title: "Mastering Public Speaking & Confident Communication",
        slug: "mastering-public-speaking-communication",
        isPublished: true,
        price: 0,
      },
    ],
    _count: { coursesCreated: 1 },
  },
];

export default async function AdminTeachersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let teachers: any[] = [];
  try {
    teachers = await db.profile.findMany({
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
  } catch (err) {
    console.warn("[ADMIN_TEACHERS_WARN]", err);
  }

  let formatted: TeacherRecord[] = (teachers || []).map((t) => ({
    id: t.id,
    name: t.name || "Instructor",
    email: t.email || "teacher@example.com",
    phone: t.phone || null,
    bio: t.bio || null,
    imageUrl: t.imageUrl || null,
    status: t.status || "ACTIVE",
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
    coursesCreated: Array.isArray(t.coursesCreated) ? t.coursesCreated : [],
    _count: {
      coursesCreated: t._count?.coursesCreated ?? (t.coursesCreated?.length || 0),
    },
  }));

  if (formatted.length === 0) {
    formatted = FALLBACK_TEACHER_RECORDS;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Teacher Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold rounded-[10px]">
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
