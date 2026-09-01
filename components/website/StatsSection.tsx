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
      label: "Active Curriculums",
      description: "Structured beginner to advanced engineering tracks",
      gradient: "from-blue-500/20 to-indigo-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      value: `${totalLearners > 0 ? totalLearners : 12}+`,
      label: "Enrolled Learners",
      description: "Active students mastering in-demand industry skills",
      gradient: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Award,
      value: `${totalChapters > 0 ? totalChapters : 20}+`,
      label: "Interactive Lessons",
      description: "Step-by-step video tutorials and practical exercises",
      gradient: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Verified Credentials",
      description: "Tamper-proof verifiable completion certificates",
      gradient: "from-purple-500/20 to-pink-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section className="py-20 border-y border-border/40 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group p-7 rounded-3xl border border-white/20 dark:border-white/10 glass-card flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-border/40 shadow-sm ${stat.iconColor}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {stat.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-normal">
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
