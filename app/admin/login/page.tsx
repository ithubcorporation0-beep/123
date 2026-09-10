"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin passcode");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Incorrect admin password. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(data.redirectUrl || "/admin");
        router.refresh();
      }, 500);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setPassword("446655");
    setError(null);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-radial from-muted/50 via-background to-background p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-1.5 rounded-xl hover:bg-muted/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-1.5 rounded-xl hover:bg-muted/50"
        >
          <span>Student/Teacher Login</span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-border/80 bg-card/95 backdrop-blur-xl rounded-3xl overflow-hidden animate-fade-in-up">
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-indigo-500 to-purple-500" />

        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className="mx-auto flex items-center justify-center">
            <Logo />
          </div>

          <div className="pt-2 flex justify-center">
            <Badge variant="outline" className="px-3 py-1 gap-1.5 bg-primary/10 text-primary border-primary/25 rounded-full text-xs font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>Administrative Portal</span>
            </Badge>
          </div>

          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Admin Passcode Access
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
            Enter the admin password to unlock all platform dashboards, user management, and course moderation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-5">
          {/* Quick preset helper pill */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <KeyRound className="h-4 w-4 text-primary shrink-0" />
              <span>Master Admin Passcode:</span>
              <code className="font-mono font-bold text-foreground bg-background px-1.5 py-0.5 rounded border">
                446655
              </code>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer ml-2"
            >
              Fill Code
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between"
              >
                <span>Passcode</span>
                <span className="text-[10px] text-muted-foreground/80 font-normal">
                  6-digit security code
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>

                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter passcode (e.g. 446655)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  autoFocus
                  disabled={isLoading || success}
                  className="pl-10 pr-10 h-12 text-center text-lg font-mono tracking-widest rounded-2xl border-border bg-background focus-visible:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Feedback */}
            {success && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Passcode verified! Loading all dashboards...</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || success || !password}
              className="w-full h-12 rounded-2xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Passcode...</span>
                </div>
              ) : success ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Redirecting to Dashboard...</span>
                </div>
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Unlock All Dashboards</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="pt-2 text-center text-xs text-muted-foreground border-t">
            <span>Entering </span>
            <span className="font-semibold text-foreground">446655</span>
            <span> grants immediate access to the Admin Panel, Instructor Workspace, and Student Portal.</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
