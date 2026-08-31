import Link from "next/link";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/website/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const defaultCourses = [
  {
    id: "course_nextjs",
    title: "Full-Stack Next.js & TypeScript Architecture",
    slug: "full-stack-nextjs-typescript-architecture",
    description: "Master modern full-stack development using Next.js 15, App Router, React Server Components, and PostgreSQL.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    category: { name: "Development" },
    level: "Intermediate",
    instructor: {
      name: "Dr. Sarah Chen",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    chapters: [{}, {}, {}, {}, {}],
    enrollments: [{}, {}, {}],
    price: 0,
  },
  {
    id: "course_design",
    title: "Design Systems & Modern UI Engineering with Figma",
    slug: "design-systems-modern-ui-engineering-figma",
    description: "A comprehensive guide to constructing enterprise-grade design systems with Figma and accessible code components.",
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
    category: { name: "Design" },
    level: "Beginner",
    instructor: {
      name: "Alex Rivera",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    chapters: [{}, {}, {}, {}],
    enrollments: [{}, {}],
    price: 0,
  },
  {
    id: "course_cloud",
    title: "Cloud Native Microservices with Docker & Kubernetes",
    slug: "cloud-native-microservices-docker-kubernetes",
    description: "Learn to architect, containerize, and orchestrate resilient microservices in production with zero downtime.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    category: { name: "Development" },
    level: "Advanced",
    instructor: {
      name: "David Kim",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    chapters: [{}, {}, {}, {}],
    enrollments: [{}, {}],
    price: 0,
  },
];

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

  const displayCourses = courses.length > 0 ? courses : defaultCourses;

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
            instructorName={course.instructor?.name || "EduFlow Instructor"}
            instructorAvatar={course.instructor?.imageUrl}
            chaptersCount={course.chapters?.length || 0}
            enrollmentsCount={course.enrollments?.length || 0}
            price={course.price || 0}
            isFree={course.price === 0}
          />
        ))}
      </div>
    </section>
  );
}
