import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentTable, StudentEnrollmentRecord } from "@/components/teacher/students/StudentTable";

export default async function TeacherStudentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch teacher courses with enrollments and progress
  const courses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: true,
        },
      },
      enrollments: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const records: StudentEnrollmentRecord[] = [];

  courses.forEach((course) => {
    const totalChapters = course.chapters.length;

    course.enrollments.forEach((enrollment) => {
      const completedChapters = course.chapters.filter((ch) =>
        ch.userProgress.some(
          (up) => up.profileId === enrollment.profileId && up.isCompleted
        )
      ).length;

      const progressPercent = totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

      records.push({
        id: enrollment.id,
        studentId: enrollment.profile.id,
        studentName: enrollment.profile.name || "Student",
        studentEmail: enrollment.profile.email,
        studentAvatar: enrollment.profile.imageUrl,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: enrollment.createdAt,
        completedChapters,
        totalChapters,
        progressPercent,
      });
    });
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Enrolled Students
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your active students, their course progress, and completion rates.
        </p>
      </div>

      <StudentTable enrollments={records} />
    </div>
  );
}
