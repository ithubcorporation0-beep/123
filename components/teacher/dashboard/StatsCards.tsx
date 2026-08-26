import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Users, PlayCircle } from "lucide-react";

interface StatsCardsProps {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalChapters: number;
}

export function StatsCards({
  totalCourses,
  publishedCourses,
  totalStudents,
  totalChapters,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Published Courses",
      value: publishedCourses,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Enrolled Students",
      value: totalStudents,
      icon: Users,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      title: "Total Chapters",
      value: totalChapters,
      icon: PlayCircle,
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="rounded-3xl border bg-card shadow-xs">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl shrink-0 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-extrabold text-foreground mt-0.5">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
