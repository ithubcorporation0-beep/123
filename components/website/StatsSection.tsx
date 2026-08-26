import { BookOpen, Users, Award, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "50+",
    label: "Interactive Courses",
    description: "Structured into beginner, intermediate & advanced paths",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Active Learners",
    description: "Students building real portfolios worldwide",
  },
  {
    icon: Award,
    value: "4,500+",
    label: "Certificates Awarded",
    description: "Issued upon completing 100% of curriculum and quizzes",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Verified Content",
    description: "Created and maintained by expert instructors",
  },
];

export function StatsSection() {
  return (
    <section className="py-12 border-y bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border bg-card/60 backdrop-blur-sm flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{stat.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
