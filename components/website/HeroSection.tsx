import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Award,
  BookOpen,
  Code2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36">
      {/* Background Radial Glow & Floating Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[550px] h-[550px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-[130px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/15 to-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Animated Feature Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-xl mb-8 shadow-sm hover:border-indigo-500/50 transition-all cursor-default">
          <Sparkles className="h-4 w-4 text-indigo-500 animate-spin-slow" />
          <span>EduFlow 2.0 • Next-Gen Interactive LMS</span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-indigo-500/20 text-[11px] font-bold text-indigo-600 dark:text-indigo-200">
            PRO PLATFORM
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl text-foreground leading-[1.1]">
          Master modern skills with{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            world-class curriculums.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed font-normal">
          Structured learning paths, HD video lessons, real-world projects, and QR-verifiable certificates built for ambitious learners and industry professionals.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold rounded-full w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold rounded-full w-full sm:w-auto gap-2.5 bg-background/80 backdrop-blur-md hover:bg-muted/80 border-border/80 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Play className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
              <span>How EduFlow Works</span>
            </Button>
          </Link>
        </div>

        {/* Social Proof & Trust Badges */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground w-full max-w-3xl">
          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden bg-muted shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden bg-muted shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden bg-muted shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                +15k
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                ))}
              </div>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                <strong>4.9 / 5.0 rating</strong> by 15,000+ graduates
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>Verified Certificates & Code Tracking</span>
          </div>
        </div>

        {/* Interactive Floating Preview Banner */}
        <div className="mt-14 w-full max-w-5xl rounded-3xl border border-white/20 dark:border-white/10 glass-card shadow-2xl p-5 sm:p-8 text-left overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs font-semibold text-foreground/80">eduflow.app/learning-hub</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Live Workspace Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-md space-y-3 transition-all hover:border-indigo-500/40 hover:shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Code2 className="h-4.5 w-4.5" /> Next.js Architecture
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-extrabold text-[11px]">Free Preview</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete hands-on course modules with interactive code player & HD video streams.
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full w-[85%] rounded-full" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-md space-y-3 transition-all hover:border-indigo-500/40 hover:shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Award className="h-4.5 w-4.5" /> Instant Certification
                </span>
                <span className="text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md font-extrabold text-[11px]">QR Verified</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated QR verification for employers and Linked-In sharing upon course completion.
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full w-[100%] rounded-full" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-md space-y-3 transition-all hover:border-indigo-500/40 hover:shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="h-4.5 w-4.5" /> Student Analytics
                </span>
                <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md font-extrabold text-[11px]">Realtime</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your quiz scores, assignments, and curriculum progression seamlessly.
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full w-[70%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
