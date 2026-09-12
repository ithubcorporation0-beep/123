import Link from "next/link";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
import { CourseCard } from "@/components/website/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section id="courses" className="py-20 px-5 sm:px-8 lg:px-12 max-w-[1585px] mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[30px] bg-[#FF9F59]/20 text-[#194866] text-xs font-bold uppercase tracking-wider">
            Featured Curriculums
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[46px] text-[#194866] font-normal leading-[1.05] tracking-tight">
            Engineering & Technology Tracks
          </h2>
          <p className="text-[#545454] max-w-2xl text-sm leading-[1.6] font-normal">
            Hands-on technical curriculums designed to prepare engineers for cloud systems, SaaS architectures, and full-stack software development.
          </p>
        </div>

        <Link href="/courses">
          <Button
            variant="outline"
            className="rounded-[40px] px-[25px] py-[12px] h-auto text-xs font-semibold border-[#DEDEDE] bg-white hover:bg-[#F2F2F2] text-[#194866] shadow-none gap-2"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="h-4 w-4 text-[#FF9F59]" />
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
