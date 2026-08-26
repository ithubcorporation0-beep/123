import { Suspense } from "react";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/website/CourseCard";
import { CoursesFilter } from "@/components/website/CoursesFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";

interface CoursesPageProps {
  searchParams: Promise<{
    categoryId?: string;
    category?: string;
    title?: string;
    search?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { categoryId, category, title, search } = await searchParams;

  const targetCategory = categoryId || category;
  const targetTitle = title || search;

  const [categories, courses] = await Promise.all([
    db.courseCategory.findMany({
      orderBy: { name: "asc" },
    }),
    db.course.findMany({
      where: {
        isPublished: true,
        ...(targetTitle && {
          title: {
            contains: targetTitle,
            mode: "insensitive",
          },
        }),
        ...(targetCategory && {
          OR: [
            { categoryId: targetCategory },
            { category: { slug: targetCategory } },
          ],
        }),
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
    }),
  ]);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Courses
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover free, top-rated interactive courses designed by industry experts.
            Learn practical skills and advance your career today.
          </p>
        </div>

        {/* Filter and search bar wrapped in Suspense */}
        <Suspense fallback={<div className="h-24 bg-muted/20 animate-pulse rounded-2xl mb-10" />}>
          <CoursesFilter categories={categories} />
        </Suspense>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                thumbnail={course.thumbnail}
                category={course.category?.name || "General"}
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
          <div className="py-12">
            <EmptyState
              icon={BookOpen}
              title="No courses found"
              description="We couldn't find any published courses matching your criteria. Try adjusting your search query or filters."
              actionLabel="View All Courses"
              actionHref="/courses"
            />
          </div>
        )}
      </div>
    </div>
  );
}
