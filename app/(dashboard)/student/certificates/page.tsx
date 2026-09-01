import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CertificateCard } from "@/components/student/certificates/CertificateCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const certificates = await db.certificate.findMany({
    where: {
      profileId: user.id,
    },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      profile: true,
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Certificates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View, download, and share your verified certificates of course completion.
          </p>
        </div>

        <Link href="/student/my-courses">
          <Button variant="outline" className="rounded-2xl gap-2 font-medium text-xs">
            <BookOpen className="h-4 w-4" />
            Resume Courses
          </Button>
        </Link>
      </div>

      {certificates.length > 0 ? (
        <div className="space-y-12">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={{
                id: cert.id,
                certificateCode: cert.certificateCode,
                issuedAt: cert.issuedAt,
                studentName: cert.profile.name || "Student",
                courseTitle: cert.course.title,
                instructorName: cert.course.instructor?.name || "IZBA Instructor",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            icon={Award}
            title="No certificates earned yet"
            description="You haven't completed a full course yet. Finish all lessons in any enrolled course to unlock your official verified certificate."
            actionLabel="View My Enrolled Courses"
            actionHref="/student/my-courses"
          />
        </div>
      )}
    </div>
  );
}
