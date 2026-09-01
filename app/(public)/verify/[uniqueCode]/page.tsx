import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CertificateVerifyPageProps {
  params: Promise<{
    uniqueCode: string;
  }>;
}

export default async function CertificateVerifyPage({
  params,
}: CertificateVerifyPageProps) {
  const { uniqueCode } = await params;
  let certificate: any = null;

  try {
    certificate = await db.certificate.findUnique({
      where: {
        certificateCode: uniqueCode,
      },
      include: {
        course: {
          include: {
            instructor: true,
            category: true,
          },
        },
        profile: true,
      },
    });
  } catch (error) {
    console.warn("[CERTIFICATE_VERIFY_PAGE] Database query failed:", error);
    certificate = null;
  }

  const formattedDate = certificate
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {certificate ? (
          <Card className="rounded-3xl border shadow-xl bg-card overflow-hidden">
            {/* Valid Certificate Header */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs">
                Verified Authentic Credential
              </Badge>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Certificate Verified
              </h1>
              <p className="text-xs text-muted-foreground">
                Issued by IZBA Learning HUB Platform Verification System
              </p>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Recipient Details */}
              <div className="p-6 rounded-2xl bg-muted/30 border space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recipient
                  </p>
                  <p className="text-2xl font-serif font-bold text-foreground capitalize mt-0.5">
                    {certificate.profile.name || "Student"}
                  </p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Completed Course
                  </p>
                  <h3 className="text-lg font-bold text-primary mt-0.5">
                    {certificate.course.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Issued on:</span>
                    <p className="font-semibold text-foreground mt-0.5">{formattedDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lead Instructor:</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {certificate.course.instructor?.name || "IZBA Instructor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credential Code */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-card/60 text-xs">
                <div>
                  <p className="text-muted-foreground">Credential Verification ID</p>
                  <p className="font-mono font-bold text-foreground text-sm mt-0.5">
                    {certificate.certificateCode}
                  </p>
                </div>
                <Link href={`/courses/${certificate.course.id}`}>
                  <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    View Course
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Invalid Certificate View */
          <Card className="rounded-3xl border shadow-lg bg-card p-12 text-center space-y-4 border-destructive/30">
            <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
              <ShieldAlert className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-foreground">
                Certificate Not Found
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                The certificate code <strong className="font-mono text-foreground">{uniqueCode}</strong> could not be verified in our records. Please double-check the credential ID.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/courses">
                <Button className="rounded-2xl font-bold gap-2 text-xs">
                  <BookOpen className="h-4 w-4" />
                  Explore Verified Courses
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
