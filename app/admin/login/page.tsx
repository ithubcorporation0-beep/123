"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        window.location.href = data.redirectUrl || "/admin";
      }, 300);
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
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#F2F2F2] p-4 sm:p-6 relative">
      {/* Back Links */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#545454] hover:text-[#194866] transition-colors font-semibold px-3 py-1.5 rounded-[30px] hover:bg-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#545454] hover:text-[#194866] transition-colors font-semibold px-3 py-1.5 rounded-[30px] hover:bg-white"
        >
          <span>Student/Teacher Login</span>
        </Link>
      </div>

      <Card className="w-full max-w-md rounded-[16px] border border-[#DEDEDE] bg-white shadow-none overflow-hidden animate-fade-in-up">
        {/* Top Accent Stripe */}
        <div className="h-1.5 w-full bg-[#194866]" />

        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className="mx-auto flex items-center justify-center">
            <Logo />
          </div>

          <div className="pt-2 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[30px] bg-[#FF9F59]/20 text-[#194866] text-xs font-bold uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-[#194866]" />
              <span>Administrative Portal</span>
            </span>
          </div>

          <CardTitle className="font-serif text-[32px] font-normal leading-[1.05] tracking-tight text-[#194866]">
            Admin Passcode Access
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-[#545454] max-w-xs mx-auto leading-[1.6]">
            Enter the admin password to unlock all platform dashboards, user management, and course moderation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-5">
          {/* Quick preset helper pill */}
          <div className="p-3.5 rounded-[16px] bg-[#F2F2F2] border border-[#DEDEDE] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#545454]">
              <KeyRound className="h-4 w-4 text-[#194866] shrink-0" />
              <span>Master Admin Passcode:</span>
              <code className="font-mono font-bold text-[#194866] bg-white px-2 py-0.5 rounded-[4px] border border-[#DEDEDE]">
                446655
              </code>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-bold text-[#194866] hover:underline cursor-pointer ml-2"
            >
              Fill Code
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-xs font-bold uppercase tracking-wider text-[#545454] flex items-center justify-between"
              >
                <span>Passcode</span>
                <span className="text-[10px] text-[#545454] font-normal">
                  6-digit security code
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454]">
                  <Lock className="h-4 w-4 text-[#194866]" />
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
                  className="pl-10 pr-10 h-11 text-center text-lg font-mono tracking-widest rounded-[4px] border-[#DEDEDE] bg-white focus-visible:border-[#194866] focus-visible:ring-1 focus-visible:ring-[#194866]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#545454] hover:text-[#194866] transition-colors cursor-pointer"
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
              <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Feedback */}
            {success && (
              <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Passcode verified! Loading all dashboards...</span>
              </div>
            )}

            {/* Submit Button (40px radius pill) */}
            <Button
              type="submit"
              disabled={isLoading || success || !password}
              className="w-full h-11 rounded-[40px] px-[25px] py-[12px] font-semibold text-sm bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="pt-2 text-center text-xs text-[#545454] border-t border-[#DEDEDE] leading-[1.6]">
            <span>Entering </span>
            <span className="font-bold text-[#194866]">446655</span>
            <span> grants immediate access to the Admin Panel, Instructor Workspace, and Student Portal.</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
