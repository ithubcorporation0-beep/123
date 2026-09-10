import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 space-y-4">
      {/* Admin Fast-Track Access Pill */}
      <div className="w-full max-w-[400px] p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Admin Access</span>
              <span className="text-[10px] font-normal text-muted-foreground">(Passcode: 446655)</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Instant login for all dashboards
            </p>
          </div>
        </div>

        <Link href="/admin/login">
          <Button size="sm" className="h-8 px-3 rounded-xl text-xs font-bold gap-1 shadow-xs">
            <KeyRound className="h-3 w-3" />
            <span>Admin</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </main>
  );
}
