import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Globe,
  TrendingUp,
  Palette,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const IT_SERVICES = [
  {
    id: "software-solutions",
    title: "Software Solutions",
    badge: "Enterprise & Scalable",
    icon: Code2,
    gradient: "from-blue-600/20 via-indigo-600/10 to-violet-600/20",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    accentBorder: "group-hover:border-blue-500/40",
    tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    description:
      "Bespoke enterprise software architectures, robust SaaS products, microservices, and custom automation workflows engineered for performance and security.",
    features: [
      "Custom SaaS & Web Application Engineering",
      "Enterprise CRM, ERP & Workflow Portals",
      "RESTful & GraphQL API Infrastructure",
      "Cloud Architecture & Database Scalability",
    ],
    tech: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS / GCP"],
  },
  {
    id: "website-solutions",
    title: "Website Solutions",
    badge: "Next-Gen & Fast",
    icon: Globe,
    gradient: "from-emerald-600/20 via-teal-600/10 to-cyan-600/20",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    accentBorder: "group-hover:border-emerald-500/40",
    tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    description:
      "Blazing-fast modern websites, responsive corporate portals, and interactive web applications optimized for 99+ Lighthouse performance scores and high conversion.",
    features: [
      "Full-Stack Next.js & React Architectures",
      "Mobile-First Responsive Layouts & PWAs",
      "Headless CMS Integration (Sanity, Strapi)",
      "Technical SEO & Web Core Vitals Tuning",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    badge: "Growth & ROI",
    icon: TrendingUp,
    gradient: "from-rose-600/20 via-pink-600/10 to-amber-600/20",
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    accentBorder: "group-hover:border-rose-500/40",
    tagColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    description:
      "Data-driven growth funnels, targeted Google & Social ad campaigns, content marketing, and high-impact SEO designed to turn traffic into qualified pipeline and revenue.",
    features: [
      "Search Engine Optimization (SEO & SERP)",
      "High-ROI PPC Ad Campaigns (Google & Meta)",
      "Lead Generation & Automated Sales Funnels",
      "Conversion Rate Optimization (CRO)",
    ],
    tech: ["Google Ads", "Meta Ads", "GA4", "Semrush", "HubSpot"],
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    badge: "Creative & Identity",
    icon: Palette,
    gradient: "from-purple-600/20 via-fuchsia-600/10 to-pink-600/20",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    accentBorder: "group-hover:border-purple-500/40",
    tagColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    description:
      "Distinctive visual branding, intuitive UI/UX design systems in Figma, compelling marketing collateral, and digital media assets that establish unmistakable brand authority.",
    features: [
      "Comprehensive Brand Identity & Guidelines",
      "Figma UI/UX Systems & Prototyping",
      "Social Media & Marketing Ad Creative Packs",
      "Print, Packaging & High-Res Vector Art",
    ],
    tech: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
  },
  {
    id: "ecommerce-solutions",
    title: "E-Commerce Solutions",
    badge: "High-Converting Stores",
    icon: ShoppingCart,
    gradient: "from-amber-600/20 via-orange-600/10 to-red-600/20",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    accentBorder: "group-hover:border-amber-500/40",
    tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    description:
      "End-to-end online stores with frictionless checkout journeys, multi-gateway payments, live inventory sync, and conversion-optimized architectures.",
    features: [
      "Custom Headless Commerce & Shopify Stores",
      "Multi-Currency Stripe & PayPal Integration",
      "Automated Inventory & Order Processing",
      "Abandoned Cart Recovery & Upsell Logic",
    ],
    tech: ["Shopify", "Stripe", "Next.js Commerce", "Redis", "Webhooks"],
  },
];

export function ITServicesSection() {
  return (
    <section id="it-services" className="py-24 relative overflow-hidden bg-background">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Professional IT & Enterprise Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            End-to-End{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              IT Solutions
            </span>{" "}
            for Scaling Brands
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Beyond education, IZBA delivers industry-grade technology services. Whether you need custom software, high-conversion web architectures, or complete digital marketing and branding, our engineering team executes with precision.
          </p>
        </div>

        {/* Services Grid (5 Main IT Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {IT_SERVICES.map((service, index) => {
            const Icon = service.icon;
            // Make the 5th item take full width on lg screens or span nicely
            const isSpan = index === 3 || index === 4;

            return (
              <div
                key={service.id}
                className={`group relative rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 ${service.accentBorder} flex flex-col justify-between overflow-hidden ${
                  index === 3 ? "lg:col-span-1 sm:col-span-1" : ""
                }`}
              >
                {/* Subtle card top gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Top bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-110 ${service.iconBg}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted/80 text-foreground border border-border/60">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-6 pt-5 border-t border-border/50 space-y-2.5">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-foreground/90 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {service.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${service.tagColor}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="relative z-10 mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={`/services?inquire=${service.id}#inquiry-form`}>
                    <Button size="sm" variant="secondary" className="rounded-full text-xs font-semibold px-3.5 h-8">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Inquiry Callout Card filling the 6th slot on 3-col grid */}
          <div className="relative rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-card/90 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider uppercase border border-indigo-500/30">
                Custom Architecture
              </span>
              <h3 className="text-2xl font-extrabold text-foreground">
                Need a Custom Combined Stack?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We design bespoke packages combining software development, e-commerce stores, dedicated brand identity, and scalable marketing campaigns tailored to your specific milestones.
              </p>
            </div>

            <div className="relative z-10 mt-8 space-y-3">
              <Link href="/services#inquiry-form" className="block w-full">
                <Button className="w-full rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 gap-2">
                  <span>Get Free Consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>NDA Protected • 24h Response Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl border border-border/80 bg-muted/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-black text-foreground">
              Ready to accelerate your technology roadmap?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Explore full service breakdowns, past deliverables, and request a detailed proposal with timeline estimates on our dedicated services page.
            </p>
          </div>
          <Link href="/services">
            <Button size="lg" className="rounded-full px-7 font-bold gap-2 shrink-0">
              <span>Explore All IT Services</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
