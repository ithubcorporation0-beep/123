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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || BookOpen;
            const courseCount = cat._count?.courses ?? 1;

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-foreground/20 transition-all duration-200 hover-card-lift shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-muted text-foreground border border-border/60">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                      {courseCount} {courseCount === 1 ? "Program" : "Programs"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {cat.description || `Comprehensive courses and practical training in ${cat.name}.`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center text-xs font-semibold text-foreground/80 gap-1.5 group-hover:text-primary transition-colors">
                  <span>Explore Track</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
