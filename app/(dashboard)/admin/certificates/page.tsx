import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CertificateManagementView, IssuedCertificate } from "@/components/admin/certificates/CertificateManagementView";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

export default async function AdminCertificatesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  let certificates: any[] = [];
  let settings: any[] = [];
  let courses: any[] = [];
  let students: any[] = [];

  try {
    const results = await Promise.allSettled([
      db.certificate.findMany({
        include: {
          profile: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { issuedAt: "desc" },
      }),
      db.adminSetting.findMany({
        where: { group: "certificate" },
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
      certificates = results[0].value;
    }
    if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
      settings = results[1].value;
    }
    if (results[2].status === "fulfilled" && Array.isArray(results[2].value)) {
      courses = results[2].value;
    }
    if (results[3].status === "fulfilled" && Array.isArray(results[3].value)) {
      students = results[3].value;
    }
  } catch (err) {
    console.warn("[ADMIN_CERTIFICATES_WARN]", err);
  }

  const config: Record<string, string> = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  const formatted: IssuedCertificate[] = certificates
    .filter((c) => Boolean(c))
    .map((c) => ({
      id: c.id,
      certificateCode: c.certificateCode || "CERT-CODE",
      issuedAt: c.issuedAt ? new Date(c.issuedAt).toISOString() : new Date().toISOString(),
      status: c.status || "VALID",
      profile: {
        id: c.profile?.id || "",
        name: c.profile?.name || "Student",
        email: c.profile?.email || "student@example.com",
      },
      course: {
        id: c.course?.id || "",
        title: c.course?.title || "Course",
        slug: c.course?.slug || "course",
      },
    }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Certificate Management
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Award className="h-3.5 w-3.5 mr-1" /> Credentials CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Issue verified digital credentials, manage certificate templates, and control completion requirements.
        </p>
      </div>

      <CertificateManagementView
        initialCertificates={formatted}
        initialSettings={config}
        allCourses={courses}
        allStudents={students}
      />
    </div>
  );
}
