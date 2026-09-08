import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Video, LineChart, ShieldCheck } from "lucide-react";

export function TeacherCTABanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-2xl bg-slate-950 dark:bg-card border border-slate-800 text-slate-100 p-8 sm:p-14 md:p-16 relative overflow-hidden shadow-xl">
        {/* Subtle engineering grid / ambient glow */}
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>EDUCATOR WORKSPACE & PUBLISHING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Deliver engineering masterclasses to thousands of ambitious learners.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            Build structured multi-chapter curriculums, stream verified video lectures, assess progress with automated quiz engines, and manage enrollments through our unified Instructor Console.
          </p>

          <div className="flex flex-wrap gap-6 pt-1 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-slate-400" />
              <span>Multi-Source Video Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-slate-400" />
              <span>Cohort Analytics & Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span>Cryptographic Certificate Verification</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap gap-3.5">
            <Link href="/register">
              <Button size="lg" className="h-11 px-6 font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-sm gap-2">
                <span>Become an Instructor</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-11 px-6 font-semibold text-slate-200 border-slate-800 hover:bg-slate-900 rounded-xl">
                Platform Architecture
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
