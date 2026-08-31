import { db } from "@/lib/db";
import { BookOpen, Users, Award, ShieldCheck } from "lucide-react";

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
      label: "Active Courses",
      description: "Structured into beginner, intermediate & advanced paths",
    },
    {
      icon: Users,
      value: `${totalLearners > 0 ? totalLearners : 12}+`,
      label: "Enrolled Learners",
      description: "Real students learning with verified progress tracking",
    },
    {
      icon: Award,
      value: `${totalChapters > 0 ? totalChapters : 20}+`,
      label: "Interactive Lessons",
      description: "Step-by-step video tutorials and practical exercises",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Verified Curriculums",
      description: "Created and maintained by expert practitioners",
    },
  ];

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
