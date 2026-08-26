import Link from "next/link";
import { Code, Palette, Briefcase, TrendingUp, Camera, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Development",
    slug: "development",
    icon: Code,
    description: "Next.js, TypeScript, PostgreSQL, APIs & cloud services",
    coursesCount: "18 courses",
  },
  {
    name: "Design",
    slug: "design",
    icon: Palette,
    description: "UI/UX design, Figma workflows, design tokens & typography",
    coursesCount: "12 courses",
  },
  {
    name: "Business",
    slug: "business",
    icon: Briefcase,
    description: "Product management, startup scaling, agile sprints & leadership",
    coursesCount: "9 courses",
  },
  {
    name: "Marketing",
    slug: "marketing",
    icon: TrendingUp,
    description: "Growth loops, SEO strategy, content funnels & user acquisition",
    coursesCount: "11 courses",
  },
  {
    name: "Photography",
    slug: "photography",
    icon: Camera,
    description: "Studio lighting, product captures, camera settings & RAW editing",
    coursesCount: "8 courses",
  },
];

export function CategorySection() {
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
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-2xl border bg-card/80 hover:bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {cat.coursesCount}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {cat.description}
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
