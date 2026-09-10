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

  const [certificates, settings, courses, students] = await Promise.all([
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

  const config: Record<string, string> = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  const formatted: IssuedCertificate[] = certificates.map((c) => ({
    id: c.id,
    certificateCode: c.certificateCode,
    issuedAt: c.issuedAt,
    status: c.status,
    profile: c.profile,
    course: c.course,
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
