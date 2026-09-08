import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Code2,
  Terminal,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Server,
  Play,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 spotlight-ambient bg-grid-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Executive Announcement Pill */}
        <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/70 bg-background/90 text-foreground text-xs font-medium backdrop-blur-md mb-8 shadow-xs hover:border-border transition-all cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-live-dot" />
          <span className="text-muted-foreground font-normal">Next-Gen LMS Platform</span>
          <span className="h-3 w-px bg-border/80" />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-foreground/90">
            Enterprise Edition
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-in-up text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-5xl leading-[1.08] headline-gradient">
          Master modern software engineering and cloud infrastructure.
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-100 mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-normal">
          Structured technical curriculums, production-ready modules, and cryptographically verified certifications designed for ambitious developers and technical teams.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-11 px-6 text-sm font-semibold rounded-xl w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all gap-2"
            >
              <span>Explore All Curriculums</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/services" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-sm font-medium rounded-xl w-full sm:w-auto gap-2 border-border/80 bg-background/80 hover:bg-muted/60 transition-all"
            >
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span>Enterprise IT Services</span>
            </Button>
          </Link>
        </div>

        {/* Enterprise Trust Metric Bar */}
        <div className="animate-fade-in-up delay-300 mt-12 pt-8 border-t border-border/50 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground w-full max-w-3xl">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cryptographic QR Verification</span>
          </div>
          <div className="h-3.5 w-px bg-border/70 hidden sm:block" />
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Lock className="h-4 w-4 text-primary" />
            <span>Strict Role-Based Multi-Tenant Panels</span>
          </div>
          <div className="h-3.5 w-px bg-border/70 hidden sm:block" />
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Server className="h-4 w-4 text-primary" />
            <span>High-Def Video Streaming & Code Sandbox</span>
          </div>
        </div>

        {/* High-Fidelity Product UI Mockup */}
        <div className="animate-fade-in-up delay-400 mt-14 w-full max-w-5xl rounded-2xl border border-border/80 bg-card/90 shadow-xl overflow-hidden text-left relative">
          {/* Mockup Window Chrome */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">izba.app / lms-console</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Production Cluster • Active</span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-background/80 border border-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" /> Architecture Track
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">MOD-01</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full-stack system architecture, microservices, containerization, and enterprise Next.js pipelines.
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Progress: 100%</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Completed</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-background/80 border border-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> Cloud & Security
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">MOD-02</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                TCP/IP routing, cloud infrastructure administration, and database optimization.
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Progress: 75%</span>
                <span className="text-primary font-semibold">Active Session</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-background/80 border border-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Verifiable Certs
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">VERIFIED</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tamper-proof digital certificates signed with unique cryptographic hash identification.
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Verification ID:</span>
                <span className="text-muted-foreground font-semibold">#IZB-84920</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
