import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Video, Users2, LineChart } from "lucide-react";

export function TeacherCTABanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-primary-foreground p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm mb-6">
            <Users2 className="h-4 w-4" /> Teach on EduFlow
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Share your knowledge with thousands of ambitious learners.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
            Create structured curriculums, upload HD lesson videos, draft quizzes, and monitor student progress with our comprehensive Instructor Panel.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-primary-foreground/90 font-medium">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Integrated Video Streaming</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Real-Time Enrollment Analytics</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-12 px-8 font-bold text-foreground rounded-xl shadow-md gap-2">
                Get Started as an Instructor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-12 px-8 font-semibold text-white border-white/30 hover:bg-white/10 rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
