import { Search, PlayCircle, CheckSquare, Award, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Select Your Track",
    description: "Browse verified course outlines, curriculum chapters, and prerequisite guides with 100% transparent access.",
    icon: Search,
    color: "from-blue-500/20 to-indigo-500/10 text-blue-600",
  },
  {
    step: "02",
    title: "Stream & Practice",
    description: "Watch high-definition video masterclasses, follow code notes, and track your active progress across all devices.",
    icon: PlayCircle,
    color: "from-purple-500/20 to-pink-500/10 text-purple-600",
  },
  {
    step: "03",
    title: "Build Real Projects",
    description: "Solidify your engineering knowledge by completing practical assignments designed around industry standards.",
    icon: CheckSquare,
    color: "from-amber-500/20 to-orange-500/10 text-amber-600",
  },
  {
    step: "04",
    title: "Earn Verified Credential",
    description: "Receive an authentic, shareable digital certificate equipped with unique cryptographic verification codes.",
    icon: Award,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Learning Journey</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          How EduFlow Works
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          From selecting your first lesson to generating a verified certificate, here is how you build real-world mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md relative flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border border-border/40 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-black text-muted-foreground/20 font-mono group-hover:text-primary/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <Link href="/courses">
          <Button size="lg" className="h-12 px-8 font-bold rounded-2xl shadow-md gap-2">
            <span>Start Learning Today</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
