import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, ArrowRight, BookOpen } from "lucide-react";

export interface RecentEnrollmentItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string | null;
  courseId: string;
  courseTitle: string;
  enrolledAt: Date | string;
}

interface RecentEnrollmentsProps {
  enrollments: RecentEnrollmentItem[];
}

export function RecentEnrollments({ enrollments }: RecentEnrollmentsProps) {
  return (
    <Card className="rounded-3xl border bg-card shadow-xs">
      <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Recent Student Enrollments</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest learners who joined your courses
          </p>
        </div>

        <Link href="/teacher/students">
          <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1 h-8">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {enrollments.length > 0 ? (
          <div className="divide-y divide-border/60">
            {enrollments.map((item) => {
              const formattedDate = new Date(item.enrolledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                      {item.studentAvatar ? (
                        <Image src={item.studentAvatar} alt={item.studentName} fill className="object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{item.studentName}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.studentEmail}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <Badge variant="outline" className="text-[11px] font-medium max-w-[180px] truncate block">
                      {item.courseTitle}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No enrollments recorded yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
