import { Search, PlayCircle, CheckSquare, Award } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discover Your Path",
    description: "Browse detailed course outlines, module breakdowns, and difficulty levels without any paywalls.",
    icon: Search,
  },
  {
    step: "02",
    title: "Learn Interactively",
    description: "Watch high-definition video lectures, read deep-dive companion articles, and track lesson progress in real time.",
    icon: PlayCircle,
  },
  {
    step: "03",
    title: "Pass Quizzes & Tasks",
    description: "Test your understanding with automated multiple-choice tests and practical project assignments.",
    icon: CheckSquare,
  },
  {
    step: "04",
    title: "Receive Certificates",
    description: "Earn tamper-evident, unique verification certificates to prove your mastery to teams and employers.",
    icon: Award,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          How EduFlow Works
        </h2>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          A seamless path from starting your first lesson to receiving an accredited course completion certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border bg-card relative flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/30 font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-2">
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
    </section>
  );
}
