import Link from "next/link";
import { CourseCard, CourseCardProps } from "@/components/website/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const placeholderCourses: CourseCardProps[] = [
  {
    id: "1",
    title: "Full-Stack Web Development with Next.js & TypeScript",
    slug: "full-stack-web-development-nextjs-typescript",
    description: "Learn App Router, Server Actions, PostgreSQL database schema modeling, authentication, and deployment.",
    category: "Development",
    instructorName: "Alex Rivera",
    lessonsCount: 24,
    duration: "12 hours",
    rating: 4.9,
    reviewsCount: 184,
    price: 0,
    isFree: true,
  },
  {
    id: "2",
    title: "UI/UX Design Systems with Figma & Tailwind CSS",
    slug: "ui-ux-design-systems-figma-tailwind",
    description: "Master modern typography, color harmony, responsive layouts, interactive prototypes, and accessible components.",
    category: "Design",
    instructorName: "Sarah Chen",
    lessonsCount: 18,
    duration: "8.5 hours",
    rating: 4.8,
    reviewsCount: 142,
    price: 0,
    isFree: true,
  },
  {
    id: "3",
    title: "Cloud Architecture & PostgreSQL Database Optimization",
    slug: "cloud-architecture-postgresql-optimization",
    description: "Scale relational databases with connection pooling, indexes, schema migrations, and high-availability setups.",
    category: "Development",
    instructorName: "Marcus Vance",
    lessonsCount: 20,
    duration: "10 hours",
    rating: 4.9,
    reviewsCount: 96,
    price: 0,
    isFree: true,
  },
  {
    id: "4",
    title: "Digital Marketing Analytics & SEO Strategy",
    slug: "digital-marketing-analytics-seo-strategy",
    description: "Data-driven marketing fundamentals, audience acquisition funnels, conversion optimization, and analytics tools.",
    category: "Marketing",
    instructorName: "Elena Rostova",
    lessonsCount: 15,
    duration: "7 hours",
    rating: 4.7,
    reviewsCount: 88,
    price: 0,
    isFree: true,
  },
  {
    id: "5",
    title: "Tech Startup Fundamentals & Product Management",
    slug: "tech-startup-fundamentals-product-management",
    description: "Take product ideas from validation to MVP, sprint planning, customer feedback loops, and market launch.",
    category: "Business",
    instructorName: "David Kim",
    lessonsCount: 16,
    duration: "9 hours",
    rating: 4.8,
    reviewsCount: 115,
    price: 0,
    isFree: true,
  },
  {
    id: "6",
    title: "Commercial Product & Portrait Photography",
    slug: "commercial-product-portrait-photography",
    description: "Master studio lighting, lens selection, composition, RAW color grading, and commercial image delivery.",
    category: "Photography",
    instructorName: "Liam O'Connor",
    lessonsCount: 14,
    duration: "6.5 hours",
    rating: 4.9,
    reviewsCount: 73,
    price: 0,
    isFree: true,
  },
];

export function FeaturedCourses() {
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
        {placeholderCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
}
