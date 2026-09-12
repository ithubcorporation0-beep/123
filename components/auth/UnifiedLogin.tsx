"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import {
  Shield,
  KeyRound,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function UnifiedLogin() {
  const [activeTab, setActiveTab] = useState<"admin" | "standard">("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAdminSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin passcode (446655)");
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
        setError(data.error || "Incorrect admin passcode. Please try again.");
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
    <div className="w-full max-w-md space-y-4">
      {/* Role Selection Tabs */}
      <div className="flex p-1 rounded-[40px] bg-[#EAEAEA] border border-[#DEDEDE] text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("admin");
            setError(null);
          }}
          className={`flex-1 py-2 rounded-[30px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "admin"
              ? "bg-[#194866] text-white shadow-xs"
              : "text-[#545454] hover:text-[#194866]"
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Admin Passcode (446655)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("standard")}
          className={`flex-1 py-2 rounded-[30px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "standard"
              ? "bg-[#194866] text-white shadow-xs"
              : "text-[#545454] hover:text-[#194866]"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Student / Teacher</span>
        </button>
      </div>

      {activeTab === "admin" ? (
        <Card className="rounded-[16px] border border-[#DEDEDE] bg-white shadow-none overflow-hidden animate-fade-in-up">
          <div className="h-1.5 w-full bg-[#194866]" />

          <CardHeader className="text-center pt-6 pb-2 space-y-2">
            <div className="mx-auto inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[30px] bg-[#FF9F59]/20 text-[#194866] text-xs font-bold uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-[#194866]" />
              <span>Direct Admin Login</span>
            </div>

            <CardTitle className="font-serif text-2xl font-normal text-[#194866]">
              Enter Admin Passcode
            </CardTitle>

            <CardDescription className="text-xs text-[#545454]">
              Enter master passcode <strong className="text-[#194866]">446655</strong> to unlock the Admin CMS panel.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            {/* Quick Fill Preset Box */}
            <div className="p-3 rounded-[12px] bg-[#F2F2F2] border border-[#DEDEDE] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#545454]">
                <KeyRound className="h-4 w-4 text-[#194866] shrink-0" />
                <span>Passcode:</span>
                <code className="font-mono font-bold text-[#194866] bg-white px-2 py-0.5 rounded border border-[#DEDEDE]">
                  446655
                </code>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-[#194866] hover:underline cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#545454]">
                  Security Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454]">
                    <Lock className="h-4 w-4 text-[#194866]" />
                  </div>

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter 446655"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    autoFocus
                    disabled={isLoading || success}
                    className="pl-10 pr-10 h-11 text-center text-lg font-mono tracking-widest rounded-[4px] border-[#DEDEDE] bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#545454] hover:text-[#194866] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Passcode verified! Opening Admin Panel...</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || success || !password}
                className="w-full h-11 rounded-[40px] px-[25px] font-semibold text-sm bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Passcode...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Redirecting...</span>
                  </div>
                ) : (
                  <>
                    <span>Unlock Admin Panel</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-[#545454] border-t border-[#DEDEDE]">
              <button
                type="button"
                onClick={() => setActiveTab("standard")}
                className="text-[#194866] hover:underline font-semibold cursor-pointer"
              >
                Sign in with Google / Email instead →
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-[12px] bg-white border border-[#DEDEDE] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#545454]">
              <Shield className="h-4 w-4 text-[#194866]" />
              <span>Looking for Admin Access?</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className="text-xs font-bold text-[#194866] hover:underline cursor-pointer"
            >
              Use Passcode 446655
            </button>
          </div>

          <SignIn routing="path" path="/login" signUpUrl="/register" />
        </div>
      )}
    </div>
  );
}
