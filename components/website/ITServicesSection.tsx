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
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
            Enterprise Solutions
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Full-Cycle Technology & Software Engineering
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Beyond education, IZBA delivers production-grade enterprise services. From custom cloud microservices to high-performance web platforms and digital growth architectures.
          </p>
        </div>

        {/* Services Grid (5 Main IT Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IT_SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-foreground/20 transition-all duration-200 hover-card-lift shadow-xs"
              >
                <div>
                  {/* Top bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-border/60 bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-5 pt-4 border-t border-border/40 space-y-2">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-foreground/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {service.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80 hover:text-primary transition-colors"
                  >
                    <span>Specifications</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link href={`/services?inquire=${service.id}#inquiry-form`}>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-medium px-3 h-7 border-border/70">
                      Request Scope
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Inquiry Callout Card filling the 6th slot on 3-col grid */}
          <div className="rounded-2xl border border-border/80 bg-foreground text-background p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-background/10 text-background border border-background/20 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-background/15 text-background text-[10px] font-mono uppercase tracking-wider font-semibold">
                Custom Architecture
              </span>
              <h3 className="text-lg font-bold text-background">
                Need a Bespoke Combined Stack?
              </h3>
              <p className="text-xs text-background/80 leading-relaxed">
                We engineer tailor-made technological engagements combining custom microservices, high-conversion storefronts, and cloud deployment pipelines.
              </p>
            </div>

            <div className="mt-6 space-y-2.5">
              <Link href="/services#inquiry-form" className="block w-full">
                <Button className="w-full rounded-xl font-semibold text-xs h-9 bg-background text-foreground hover:bg-background/90 shadow-xs gap-1.5">
                  <span>Schedule Consultation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-background/70 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>NDA Protected • 24h Turnaround</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-foreground">
              Ready to accelerate your engineering roadmap?
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl">
              Explore full service breakdowns, past deliverables, and request a detailed proposal with timeline estimates.
            </p>
          </div>
          <Link href="/services">
            <Button size="sm" className="rounded-xl px-5 h-9 font-semibold text-xs gap-1.5 shrink-0">
              <span>View All Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
