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
    <section className="py-24 bg-[#F2F2F2] border-y border-[#DEDEDE] relative">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[30px] bg-[#194866] text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FF9F59]" />
            <span>Main IT Services & Specializations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[46px] text-[#194866] font-normal leading-[1.05] tracking-tight">
            Explore by Specialization
          </h2>
          <p className="text-[#545454] text-sm sm:text-base leading-[1.6] font-normal">
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
                className="group p-6 rounded-[16px] border border-[#DEDEDE] bg-white hover:border-[#194866]/50 transition-all duration-200 hover:-translate-y-1 shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-[12px] bg-[#F2F2F2] text-[#194866] border border-[#DEDEDE]">
                      <Icon className="h-5 w-5 text-[#194866]" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-[30px] bg-[#F2F2F2] text-[#545454] border border-[#DEDEDE]">
                      {courseCount} {courseCount === 1 ? "Program" : "Programs"}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#194866] font-normal group-hover:text-[#194866] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#545454] mt-2 leading-[1.6]">
                    {cat.description || `Comprehensive courses and practical training in ${cat.name}.`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DEDEDE] flex items-center text-xs font-semibold text-[#194866] gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Explore Track</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FF9F59]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
