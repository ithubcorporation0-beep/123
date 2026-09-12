import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
import { EnrollmentManagementView, EnrollmentRecord } from "@/components/admin/enrollments/EnrollmentManagementView";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const FALLBACK_STUDENTS_LIST = [
  {
    id: "student_emily",
    name: "Emily Clark",
    email: "emily.clark@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "student_marcus",
    name: "Marcus Vance",
    email: "marcus.vance@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "student_sophia",
    name: "Sophia Chen",
    email: "sophia.chen@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "student_david",
    name: "David Kim",
    email: "david.kim@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "student_elena",
    name: "Elena Rostova",
    email: "elena.rostova@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "student_jamal",
    name: "Jamal Washington",
    email: "jamal.washington@student.izba.app",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
  },
];

const DEMO_ENROLLMENTS: EnrollmentRecord[] = [
  {
    id: "enr_1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[0],
    course: {
      id: "course_creative_design",
      title: "Creative Visual Arts & Graphic Design Mastery",
      slug: "creative-visual-arts-graphic-design",
      thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "enr_2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[1],
    course: {
      id: "course_data_science",
      title: "Foundations of Data Science & Critical Thinking",
      slug: "foundations-of-data-science-critical-thinking",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "enr_3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[2],
    course: {
      id: "course_public_speaking",
      title: "Mastering Public Speaking & Confident Communication",
      slug: "mastering-public-speaking-communication",
      thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "enr_4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[3],
    course: {
      id: "course_personal_finance",
      title: "Financial Literacy, Personal Finance & Smart Investing",
      slug: "financial-literacy-personal-finance-investing",
      thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "enr_5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[4],
    course: {
      id: "course_mindfulness_productivity",
      title: "Mindfulness, Habit Formation & Personal Growth",
      slug: "mindfulness-productivity-personal-growth",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "enr_6",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    profile: FALLBACK_STUDENTS_LIST[5],
    course: {
      id: "course_business_leadership",
      title: "Mastering Business Leadership & Strategic Management",
      slug: "mastering-business-leadership-management",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
    },
  },
];

export default async function AdminEnrollmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let dbEnrollments: any[] = [];
  let dbCourses: any[] = [];
  let dbStudents: any[] = [];

  try {
    const results = await Promise.allSettled([
      db.enrollment.findMany({
        include: {
          profile: {
            select: { id: true, name: true, email: true, imageUrl: true },
          },
          course: {
            select: { id: true, title: true, slug: true, thumbnail: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.course.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
      }),
      db.profile.findMany({
        where: { role: "student" },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      }),
    ]);

    if (results[0].status === "fulfilled" && Array.isArray(results[0].value)) {
      dbEnrollments = results[0].value;
    }
    if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
      dbCourses = results[1].value;
    }
    if (results[2].status === "fulfilled" && Array.isArray(results[2].value)) {
      dbStudents = results[2].value;
    }
  } catch (err) {
    console.warn("[ADMIN_ENROLLMENTS_WARN]", err);
  }

  // Fallbacks if tables are empty
  if (dbCourses.length === 0) {
    dbCourses = FALLBACK_COURSES.map((c) => ({ id: c.id, title: c.title }));
  }

  if (dbStudents.length === 0) {
    dbStudents = FALLBACK_STUDENTS_LIST.map((s) => ({ id: s.id, name: s.name, email: s.email }));
  }

  let formatted: EnrollmentRecord[] = dbEnrollments
    .filter((e) => Boolean(e && e.profile && e.course))
    .map((e) => ({
      id: e.id,
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
      profile: {
        id: e.profile.id,
        name: e.profile.name || "Student",
        email: e.profile.email || "student@example.com",
        imageUrl: e.profile.imageUrl || null,
      },
      course: {
        id: e.course.id,
        title: e.course.title || "Course",
        slug: e.course.slug || "course",
        thumbnail: e.course.thumbnail || null,
      },
    }));

  if (formatted.length === 0) {
    formatted = DEMO_ENROLLMENTS;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Enrollment Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold rounded-[10px]">
            <Users className="h-3.5 w-3.5 mr-1" /> Registrations CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review real-time course enrollments, filter by student or course, manually assign learners, and revoke registrations.
        </p>
      </div>

      <EnrollmentManagementView
        initialEnrollments={formatted}
        allCourses={dbCourses}
        allStudents={dbStudents}
      />
    </div>
  );
}
