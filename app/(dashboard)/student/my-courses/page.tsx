import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import Link from "next/link";

export default function MyCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Enrolled Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access all your active courses, resume video lessons, and review submitted assignments.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm p-8 text-center flex flex-col items-center justify-center border-dashed">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg">You haven't enrolled in any courses yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Explore our available curriculum in web development, design, cloud architecture, and marketing to start learning.
        </p>
        <Link href="/courses" className="mt-5">
          <Button className="gap-2 rounded-xl">
            <Search className="h-4 w-4" />
            Explore Course Catalog
          </Button>
        </Link>
      </Card>
    </div>
  );
}
