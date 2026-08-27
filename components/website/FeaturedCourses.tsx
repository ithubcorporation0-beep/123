import Link from "next/link";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/website/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export async function FeaturedCourses() {
  let courses: any[] = [];
  try {
    courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        instructor: true,
        chapters: {
          where: {
            isPublished: true,
          },
        },
        enrollments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
  } catch (error) {
    console.warn("[FEATURED_COURSES] Could not fetch courses from database:", error);
    courses = [];
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Featured Courses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Top Learning Programs
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
            Comprehensive curriculums built from the ground up to prepare you for real-world development and design challenges.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" className="gap-2 font-medium rounded-xl">
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              slug={course.slug}
              description={course.description}
              thumbnail={course.thumbnail}
              category={course.category?.name || "Development"}
              level={course.level || "Beginner"}
              instructorName={course.instructor?.name || "EduFlow Instructor"}
              instructorAvatar={course.instructor?.imageUrl}
              chaptersCount={course.chapters.length}
              enrollmentsCount={course.enrollments.length}
              price={course.price || 0}
              isFree={course.price === 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            New courses are being prepared. Check back soon or browse the full catalog.
          </p>
          <Link href="/courses" className="mt-4 inline-block">
            <Button variant="default" size="sm" className="rounded-xl">
              Browse Catalog
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
