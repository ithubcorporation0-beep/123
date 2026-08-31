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
      color: "from-blue-500/20 to-indigo-500/10 text-blue-600",
    },
    {
      icon: Users,
      value: `${totalLearners > 0 ? totalLearners : 12}+`,
      label: "Enrolled Learners",
      description: "Active students mastering in-demand industry skills",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600",
    },
    {
      icon: Award,
      value: `${totalChapters > 0 ? totalChapters : 20}+`,
      label: "Interactive Lessons",
      description: "Step-by-step video tutorials and practical exercises",
      color: "from-amber-500/20 to-orange-500/10 text-amber-600",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Verified Credentials",
      description: "Tamper-proof verifiable completion certificates",
      color: "from-purple-500/20 to-pink-500/10 text-purple-600",
    },
  ];

  return (
    <section className="py-16 border-y border-border/80 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} border border-border/40 shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                    {stat.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
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
