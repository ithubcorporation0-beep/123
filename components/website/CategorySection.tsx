import Link from "next/link";
import { db } from "@/lib/db";
import {
  Code2,
  Globe,
  TrendingUp,
  Palette,
  ShoppingCart,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, any> = {
  "software-solutions": Code2,
  "website-solutions": Globe,
  "digital-marketing": TrendingUp,
  "graphic-design": Palette,
  "ecommerce-solutions": ShoppingCart,
};

const categoryColorMap: Record<string, string> = {
  "software-solutions": "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400",
  "website-solutions": "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  "digital-marketing": "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400",
  "graphic-design": "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400",
  "ecommerce-solutions": "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
};

const defaultCategories = [
  {
    id: "cat_software",
    name: "Software Solutions",
    slug: "software-solutions",
    description: "Enterprise software architecture, scalable SaaS products, APIs, and cloud microservices.",
    _count: { courses: 1 },
  },
  {
    id: "cat_website",
    name: "Website Solutions",
    slug: "website-solutions",
    description: "Modern web engineering, Next.js applications, responsive portals, and headless CMS.",
    _count: { courses: 1 },
  },
  {
    id: "cat_mktg",
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO optimization, Google & Meta ad campaigns, growth funnels, and performance marketing.",
    _count: { courses: 1 },
  },
  {
    id: "cat_design",
    name: "Graphic Design",
    slug: "graphic-design",
    description: "Brand identity systems, UI/UX prototyping in Figma, vector art, and creative media.",
    _count: { courses: 1 },
  },
  {
    id: "cat_ecommerce",
    name: "E-Commerce Solutions",
    slug: "ecommerce-solutions",
    description: "High-converting online storefronts, Shopify & headless engines, and payment integrations.",
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
    <section className="py-24 bg-muted/20 border-y border-border/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Main IT Services & Specializations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Explore by Specialization
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Dive into our 5 core technology domains structured for rapid mastery, portfolio building, and real enterprise delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || BookOpen;
            const colorClass = categoryColorMap[cat.slug] || "from-primary/20 to-primary/10 text-primary";
            const courseCount = cat._count?.courses ?? 1;

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md hover:bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClass} border border-border/40 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted/80 text-foreground border border-border/60">
                      {courseCount} {courseCount === 1 ? "Program" : "Programs"}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {cat.description || `Comprehensive courses and practical training in ${cat.name}.`}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Browse {cat.name} Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
