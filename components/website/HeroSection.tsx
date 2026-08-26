import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-full border">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Free & Production-Ready LMS
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.15] text-foreground">
          Learn, build, and earn certificates at your own pace.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          EduFlow provides structured curricula, interactive quizzes, video tutorials, and project assignments designed for aspiring engineers, creators, and professionals.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-xl w-full sm:w-auto shadow-md gap-2">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold rounded-xl w-full sm:w-auto gap-2">
              <Play className="h-4 w-4 text-primary fill-primary" />
              How It Works
            </Button>
          </Link>
        </div>

        {/* Value Propositions */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>100% Free Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Verified Certificates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Real Progression Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
