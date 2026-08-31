import { Suspense } from "react";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
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

export const dynamic = "force-dynamic";

const defaultCategoryList = [
  { id: "cat_dev", name: "Development", slug: "development" },
  { id: "cat_design", name: "Design", slug: "design" },
  { id: "cat_biz", name: "Business", slug: "business" },
  { id: "cat_photo", name: "Photography", slug: "photography" },
];

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { categoryId, category, title, search } = await searchParams;

  const targetCategory = categoryId || category;
  const targetTitle = title || search;

  let categories: any[] = [];
  let courses: any[] = [];

  try {
    const [fetchedCategories, fetchedCourses] = await Promise.all([
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
    categories = fetchedCategories;
    courses = fetchedCourses;
  } catch (error) {
    console.warn("[COURSES_PAGE] Database query failed, using catalog:", error);
    categories = [];
    courses = [];
  }

  const finalCategories = categories.length > 0 ? categories : defaultCategoryList;

  let displayCourses = courses;
  if (displayCourses.length === 0) {
    let filtered = FALLBACK_COURSES;
    if (targetCategory) {
      filtered = filtered.filter(
        (c) =>
          c.category.slug.toLowerCase() === targetCategory.toLowerCase() ||
          c.category.id.toLowerCase() === targetCategory.toLowerCase()
      );
    }
    if (targetTitle) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(targetTitle.toLowerCase()) ||
          c.description.toLowerCase().includes(targetTitle.toLowerCase())
      );
    }
    displayCourses = filtered.map((c) => ({
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
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <span>Verified Curriculums</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore All Courses
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Discover free, interactive, project-based courses designed by industry engineers.
            Learn practical skills and earn verified credentials today.
          </p>
        </div>

        {/* Filter and search bar wrapped in Suspense */}
        <Suspense fallback={<div className="h-24 bg-muted/20 animate-pulse rounded-2xl mb-10" />}>
          <CoursesFilter categories={finalCategories} />
        </Suspense>

        {/* Courses Grid */}
        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {displayCourses.map((course) => (
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
          <div className="py-16">
            <EmptyState
              icon={BookOpen}
              title="No courses found"
              description="We couldn't find any courses matching your selected filter. Try choosing another category or clearing your search term."
              actionLabel="View All Courses"
              actionHref="/courses"
            />
          </div>
        )}
      </div>
    </div>
  );
}
