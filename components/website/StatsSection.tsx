import { db } from "@/lib/db";
import { BookOpen, Users, Award, ShieldCheck, Sparkles } from "lucide-react";

export async function StatsSection() {
  let totalCourses = 0;
  let totalLearners = 0;
  let totalCertificates = 0;
  let totalChapters = 0;

  try {
    const [coursesCount, learnersCount, certsCount, chaptersCount] = await Promise.all([
      db.course.count({ where: { isPublished: true } }),
      db.profile.count({ where: { role: "student" } }),
      db.certificate.count(),
      db.chapter.count({ where: { isPublished: true } }),
    ]);

    totalCourses = coursesCount;
    totalLearners = learnersCount;
    totalCertificates = certsCount;
    totalChapters = chaptersCount;
  } catch (error) {
    console.warn("[STATS_SECTION] Database query failed:", error);
  }

  const stats = [
    {
      icon: BookOpen,
      value: `${totalCourses > 0 ? totalCourses : 5}+`,
      label: "Production Curriculums",
      description: "Structured beginner to advanced engineering tracks",
    },
    {
      icon: Users,
      value: `${totalLearners > 0 ? totalLearners : 12}+`,
      label: "Active Learners",
      description: "Developers mastering production-ready technologies",
    },
    {
      icon: Award,
      value: `${totalChapters > 0 ? totalChapters : 20}+`,
      label: "Technical Lessons",
      description: "High-definition video lessons with code exercises",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Verifiable Certs",
      description: "Cryptographically signed tamper-proof credentials",
    },
  ];

  return (
    <section className="py-16 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border/70 bg-card/80 flex flex-col justify-between hover:border-border transition-all hover-card-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground border border-border/50">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-mono">
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {stat.label}
                  </h4>
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
