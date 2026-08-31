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
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Gradients & Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Animated Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold backdrop-blur-md mb-8 shadow-sm hover:border-primary/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-foreground font-medium">EduFlow 2.0</span>
          <span className="text-muted-foreground">•</span>
          <span>Free Certified Curriculums</span>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl text-foreground leading-[1.12]">
          Learn, build, & master{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            real-world skills
          </span>{" "}
          at your pace.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Structured curriculums, interactive video masterclasses, hands-on projects, and verified credentials designed by leading software engineers and industry practitioners.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-13 px-8 text-base font-bold rounded-2xl w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
            >
              Explore All Courses
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>

          <Link href="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 text-base font-semibold rounded-2xl w-full sm:w-auto gap-2 bg-background/80 backdrop-blur-sm hover:bg-muted/60"
            >
              <Play className="h-4 w-4 text-primary fill-primary" />
              How EduFlow Works
            </Button>
          </Link>
        </div>

        {/* Social Proof & Trust Badges */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground w-full max-w-3xl">
          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center">
                +12k
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-[11px] font-medium text-foreground">
                <strong>4.9 / 5.0</strong> by 12,000+ students
              </p>
            </div>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-foreground font-medium">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span>Verified Credentials & Code-Checked</span>
          </div>
        </div>

        {/* Interactive Floating Preview Banner */}
        <div className="mt-14 w-full max-w-5xl rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl p-4 sm:p-6 text-left overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 opacity-50" />
          
          <div className="flex items-center justify-between border-b pb-4 mb-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-foreground/80">eduflow.internal/student-dashboard</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Interactive Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <Code2 className="h-4 w-4" /> Next.js Architecture
                </span>
                <span className="text-emerald-600 font-bold">100% Free</span>
              </div>
              <p className="text-xs text-muted-foreground">
                5 In-depth chapters with full source code & video player.
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-primary h-full w-[80%] rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <Award className="h-4 w-4" /> Certificate Tracking
                </span>
                <span className="text-primary font-bold">Shareable</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Instant QR-verifiable credential generation upon completion.
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-emerald-500 h-full w-[100%] rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <TrendingUp className="h-4 w-4" /> Career Ready
                </span>
                <span className="text-foreground font-bold">Industry Vetted</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Hands-on assignments graded with real instructor feedback.
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-indigo-500 h-full w-[65%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
