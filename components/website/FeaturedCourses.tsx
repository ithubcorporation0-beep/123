import Link from "next/link";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
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
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      take: 6,
    });
  } catch (error) {
    console.warn("[FEATURED_COURSES] Could not fetch courses from database:", error);
    courses = [];
  }

  const displayCourses =
    courses.length > 0
      ? courses
      : FALLBACK_COURSES.map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          description: c.description,
          thumbnail: c.thumbnail,
          category: c.category,
          level: c.level,
          instructor: c.instructor,
          chapters: c.chapters,
          enrollments: Array(c.enrollmentsCount).fill({}),
          price: c.price,
        }));

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
            Featured Curriculums
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Engineering & Technology Tracks
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Hands-on technical curriculums designed to prepare engineers for cloud systems, SaaS architectures, and full-stack software development.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" className="h-10 px-4 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted/60 shadow-xs gap-1.5">
            <span>Browse Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCourses.map((course) => (
          <CourseCard
            key={course.id || course.slug}
            id={course.id}
            title={course.title}
            slug={course.slug}
            description={course.description}
            thumbnail={course.thumbnail}
            category={course.category?.name || "Development"}
            level={course.level || "Beginner"}
            instructorName={course.instructor?.name || "IZBA Instructor"}
            instructorAvatar={course.instructor?.imageUrl}
            chaptersCount={course.chapters?.length || 5}
            enrollmentsCount={course.enrollments?.length || 120}
            price={course.price || 0}
            isFree={course.price === 0}
          />
        ))}
      </div>
    </section>
  );
}
