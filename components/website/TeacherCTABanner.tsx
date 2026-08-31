import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Video, Users2, LineChart, Sparkles } from "lucide-react";

export function TeacherCTABanner() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-blue-700 text-white p-8 sm:p-14 md:p-18 shadow-2xl shadow-primary/20 relative overflow-hidden">
        {/* Background Ambient Elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <GraduationCap className="w-[450px] h-[450px]" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-xs font-bold backdrop-blur-md border border-white/20">
            <Sparkles className="h-4 w-4" /> 
            <span>Educator & Instructor Network</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Share your expertise with thousands of ambitious learners.
          </h2>

          <p className="text-base sm:text-lg text-white/85 leading-relaxed">
            Create multi-chapter curriculums, publish video masterclasses, attach project assignments, and manage student enrollments with our dedicated Instructor Workspace.
          </p>

          <div className="flex flex-wrap gap-6 pt-2 text-sm text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <Video className="h-4.5 w-4.5 text-blue-200" />
              <span>Built-in Video Streaming</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4.5 w-4.5 text-blue-200" />
              <span>Real-Time Student Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-blue-200" />
              <span>Automated Certificate Issuance</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-13 px-8 font-bold text-foreground bg-white hover:bg-white/90 rounded-2xl shadow-lg gap-2">
                <span>Become an Instructor</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-13 px-8 font-semibold text-white border-white/30 hover:bg-white/10 rounded-2xl backdrop-blur-sm">
                Explore Platform Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
