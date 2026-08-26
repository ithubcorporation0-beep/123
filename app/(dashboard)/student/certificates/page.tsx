import { Card } from "@/components/ui/card";
import { Award, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Certificates of Completion</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View, share, and verify your official course completion credentials.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm p-8 text-center flex flex-col items-center justify-center border-dashed">
        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 mb-3">
          <Award className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg">No certificates earned yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Complete 100% of the lessons, quizzes, and project assignments in any enrolled course to automatically generate your official certificate.
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/60 px-4 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Every certificate includes a unique verification code and public link.</span>
        </div>
      </Card>
    </div>
  );
}
