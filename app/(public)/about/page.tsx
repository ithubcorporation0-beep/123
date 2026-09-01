import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Sparkles, HeartHandshake, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About IZBA Learning HUB — Modern Education Platform",
  description: "Learn more about IZBA Learning HUB's mission to make world-class technical education free, structured, and verifiable.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <Badge variant="secondary" className="py-1 px-3.5 text-xs font-semibold rounded-full border">
          <Sparkles className="h-3.5 w-3.5 text-primary mr-1.5 inline" /> Our Story & Mission
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Empowering learners through real, structured knowledge.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          IZBA Learning HUB was founded on the belief that high-quality technical education should be accessible to everyone, with real curriculum progression and authentic certificates of achievement.
        </p>
      </section>

      {/* Core Values Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Core Principles</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Everything we build is designed to make learning engaging, transparent, and career-relevant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6 flex flex-col justify-between">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Zero Placeholder Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4 text-sm text-muted-foreground leading-relaxed">
              We never use mock buttons, fake enrollments, or simulated scores. Every course delivers real, actionable technical material with working code examples.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6 flex flex-col justify-between">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Verifiable Competency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4 text-sm text-muted-foreground leading-relaxed">
              Students earn certificates only after completing 100% of course lessons, quizzes, and assignments, giving certificates authentic credibility.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6 flex flex-col justify-between">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Dedicated Creator Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4 text-sm text-muted-foreground leading-relaxed">
              Instructors receive a dedicated workspace with video management, lesson builders, and student analytics to deliver their best teaching.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Features Breakdown */}
      <section className="rounded-3xl border bg-muted/20 p-8 sm:p-12 space-y-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            What Sets IZBA Learning HUB Apart
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Engineered with modern full-stack technologies for an uncompromising learner experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-foreground">Adaptive Video Streaming</h4>
              <p className="text-xs text-muted-foreground mt-1">High-performance video delivery powered by Mux with instant playback and zero buffering.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-foreground">Granular Role Security</h4>
              <p className="text-xs text-muted-foreground mt-1">Server-side verified workspaces for Students, Instructors, and Administrators.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-foreground">Automated Quiz Scoring</h4>
              <p className="text-xs text-muted-foreground mt-1">Real database records tracking attempt scores, passing thresholds, and retries.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-foreground">Accessible Design System</h4>
              <p className="text-xs text-muted-foreground mt-1">Designed with clean typography, dark-mode support, and WCAG-compliant contrast.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-wrap items-center gap-4">
          <Link href="/courses">
            <Button size="lg" className="rounded-xl font-semibold">
              Browse Course Catalog
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="rounded-xl font-medium">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
