import { Search, PlayCircle, CheckSquare, Award, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Curriculum Selection",
    description: "Browse verified engineering outlines, prerequisite tracks, and technical syllabi with 100% transparency.",
    icon: Search,
  },
  {
    step: "02",
    title: "Module Execution",
    description: "Stream high-definition video masterclasses, execute code notes, and monitor your continuous telemetry progress.",
    icon: PlayCircle,
  },
  {
    step: "03",
    title: "Practical Deliverables",
    description: "Solidify production engineering knowledge through hands-on assignments modeled on enterprise workflows.",
    icon: CheckSquare,
  },
  {
    step: "04",
    title: "Verifiable Credential",
    description: "Receive a tamper-proof digital certificate issued with cryptographic verification codes for industry validation.",
    icon: Award,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
        <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
          Platform Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          How IZBA Delivers Mastery
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          From first lesson enrollment to cryptographic certification, our platform ensures systematic engineering skill acquisition.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col justify-between hover:border-foreground/20 transition-all hover-card-lift shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-muted text-foreground border border-border/60">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground/60">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link href="/courses">
          <Button className="h-10 px-6 font-semibold text-xs rounded-xl shadow-xs gap-1.5">
            <span>Begin Learning</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
