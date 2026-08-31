import Link from "next/link";
import { db } from "@/lib/db";
import {
  Code,
  Palette,
  Briefcase,
  TrendingUp,
  Camera,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, any> = {
  development: Code,
  design: Palette,
  business: Briefcase,
  marketing: TrendingUp,
  photography: Camera,
};

const defaultCategories = [
  {
    id: "cat_dev",
    name: "Development",
    slug: "development",
    description: "Next.js, TypeScript, PostgreSQL, and modern cloud architectures.",
    _count: { courses: 2 },
  },
  {
    id: "cat_design",
    name: "Design",
    slug: "design",
    description: "Design systems, Figma workflows, and accessible UI engineering.",
    _count: { courses: 1 },
  },
  {
    id: "cat_biz",
    name: "Business",
    slug: "business",
    description: "Product discovery, KPI metrics, and growth loop strategies.",
    _count: { courses: 1 },
  },
  {
    id: "cat_mktg",
    name: "Marketing",
    slug: "marketing",
    description: "Growth loops, SEO optimization, and developer acquisition.",
    _count: { courses: 1 },
  },
  {
    id: "cat_photo",
    name: "Photography",
    slug: "photography",
    description: "Studio lighting setups and professional RAW post-processing.",
    _count: { courses: 1 },
  },
];

export async function CategorySection() {
  let categories: any[] = [];

  try {
    categories = await db.courseCategory.findMany({
      include: {
        _count: {
          select: {
            courses: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.warn("[CATEGORY_SECTION] Failed to fetch categories:", error);
    categories = [];
  }

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-20 bg-muted/20 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Categories
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            Choose a subject to dive into structured learning modules and build practical skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || BookOpen;
            const courseCount = cat._count?.courses ?? 0;

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-2xl border bg-card/80 hover:bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {courseCount} {courseCount === 1 ? "course" : "courses"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {cat.description || `Comprehensive courses and practical training in ${cat.name}.`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
