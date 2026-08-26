import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeacherStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Enrolled Students</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor student progression, quiz attempts, and lesson completion rates.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm p-8 text-center flex flex-col items-center justify-center border-dashed">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3">
          <Users className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg">No enrolled students yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          When students enroll in your courses, their progress and quiz scores will appear here.
        </p>
      </Card>
    </div>
  );
}
