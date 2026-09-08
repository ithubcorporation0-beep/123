import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Rocket,
  Headphones,
  Check,
} from "lucide-react";
import { ServiceInquiryForm } from "@/components/website/ServiceInquiryForm";

export const metadata = {
  title: "IT Services & Solutions — Software, Web, Marketing, Design & E-Commerce | IZBA",
  description:
    "Explore IZBA's enterprise-grade IT services: custom software engineering, modern website solutions, performance digital marketing, brand graphic design, and turnkey e-commerce systems.",
};

const DETAILED_SERVICES = [
  {
    id: "software-solutions",
    title: "Software Solutions",
    tagline: "Custom web applications, enterprise SaaS platforms, APIs, and automated backends engineered for security, speed, and massive concurrency.",
    icon: Code2,
    badge: "Full-Stack Software Architecture",
    deliverables: [
      "Custom SaaS platforms & enterprise multi-tenant architectures",
      "Internal tooling, CRM, ERP, and administration dashboards",
      "RESTful, GraphQL, and webhook API development & integrations",
      "Microservices orchestration, Docker containerization, and CI/CD pipelines",
      "PostgreSQL, Redis, and distributed database optimization",
      "Enterprise authentication, RBAC, and SOC-2 compliant security",
    ],
    tech: ["Node.js", "Python", "Go", "PostgreSQL", "Docker", "AWS", "Prisma"],
  },
  {
    id: "website-solutions",
    title: "Website Solutions",
    tagline: "Modern, high-performance web applications, corporate brand portals, and interactive digital interfaces built with Next.js.",
    icon: Globe,
    badge: "Next.js & Frontend Engineering",
    deliverables: [
      "Modern server-rendered Next.js and React web applications",
      "High-converting marketing portals with sub-second page loads",
      "Headless CMS setups (Sanity, Strapi, Contentful) for non-technical teams",
      "Fluid responsive UI/UX across all mobile, tablet, and ultra-wide screens",
      "Web Core Vitals optimization and technical SEO foundations",
      "Progressive Web Apps (PWA) with offline caching capabilities",
    ],
    tech: ["Next.js 15+", "React 19", "TypeScript", "Tailwind CSS", "Vercel", "Cloudflare Pages"],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Performance-driven growth campaigns that capture demand and maximize ROI.",
    icon: TrendingUp,
    badge: "Growth, PPC & Performance Funnels",
    deliverables: [
      "Technical, On-Page, and Content SEO architecture for top SERP rankings",
      "Google Ads (Search, Display, YouTube) & Meta Ads management",
      "High-conversion sales funnels and automated email sequences",
      "Conversion Rate Optimization (CRO) with A/B split testing",
      "Advanced Google Analytics 4 (GA4) & server-side event tracking",
      "Audience retargeting and lead generation workflows",
    ],
    tech: ["Google Ads", "Meta Ads Manager", "GA4", "Semrush", "HubSpot", "Klaviyo"],
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    tagline: "Compelling visual storytelling and world-class design systems that captivate.",
    icon: Palette,
    badge: "Identity, UI/UX & Creative Media",
    deliverables: [
      "Comprehensive corporate brand identity and visual guidelines",
      "Full UI/UX design systems and interactive prototypes in Figma",
      "Social media content kits and high-CTR marketing ad creatives",
      "Vector logos, iconography, and custom digital illustrations",
      "Investor pitch decks, executive presentations, and PDF whitepapers",
      "Print, packaging, and outdoor advertising collateral",
    ],
    tech: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects", "InDesign"],
  },
  {
    id: "ecommerce-solutions",
    title: "E-Commerce Solutions",
    tagline: "High-converting digital storefronts engineered to maximize sales and scale orders.",
    icon: ShoppingCart,
    badge: "Turnkey Online Stores & Checkout",
    deliverables: [
      "Custom headless commerce storefronts and optimized Shopify setups",
      "Global payment processing (Stripe, PayPal, Apple Pay, Klarna)",
      "Real-time inventory sync, warehouse alerts, and order management",
      "Frictionless single-page checkout and abandoned cart automations",
      "Product recommendation engines and dynamic upsell funnels",
      "Multi-currency, localization, and automated tax calculations",
    ],
    tech: ["Shopify Plus", "Next.js Commerce", "Stripe API", "WooCommerce", "Redis", "Medusa"],
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Blueprint",
    description:
      "We dissect your business goals, user personas, technical constraints, and competitive landscape to establish a razor-sharp scope of work.",
  },
  {
    step: "02",
    title: "Architecture & UI/UX",
    description:
      "Our team creates interactive Figma prototypes, database schemas, and system architecture diagrams before a single line of production code is written.",
  },
  {
    step: "03",
    title: "Agile Development & QA",
    description:
      "Bi-weekly sprints, transparent staging deployments, automated testing suites, and continuous stakeholder review ensure zero surprises.",
  },
  {
    step: "04",
    title: "Launch & Growth SLA",
    description:
      "Seamless production deployment, DNS configuration, speed audits, security hardening, staff training, and ongoing technical support.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/60 text-foreground text-xs font-mono tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>ENTERPRISE IT & SOFTWARE SERVICES</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
          Full-Spectrum{" "}
          <span className="headline-gradient">
            IT Engineering
          </span>{" "}
          Built for Scale
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          From mission-critical software systems and blazing-fast web applications to revenue-generating digital marketing, brand design, and e-commerce platforms — we deliver end-to-end technology solutions that empower your business.
        </p>

        {/* Quick Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>100% Production-Grade Code</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-foreground/70" />
            <span>IP Ownership & Full Non-Disclosure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-foreground/70" />
            <span>Agile Sprint Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-foreground/70" />
            <span>24/7 Technical SLA Support</span>
          </div>
        </div>

        {/* CTA Anchor */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <Link href="#inquiry-form">
            <Button size="lg" className="rounded-xl px-6 h-11 font-semibold gap-2">
              <span>Request a Custom Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#services-detail">
            <Button size="lg" variant="outline" className="rounded-xl px-6 h-11 font-semibold border-border/80">
              Explore All 5 Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Detailed Services Deep Dive */}
      <section id="services-detail" className="space-y-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our 5 Main IT Service Pillars
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Each service is backed by senior engineers, battle-tested methodologies, and modern technology frameworks.
          </p>
        </div>

        <div className="space-y-10">
          {DETAILED_SERVICES.map((srv, index) => {
            const Icon = srv.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={srv.id}
                id={srv.id}
                className="scroll-mt-28 rounded-2xl border border-border/80 bg-card p-8 sm:p-10 shadow-xs hover:border-foreground/20 transition-all duration-200 relative overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  {/* Left/Main Column: Info (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-muted text-foreground border border-border/60 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                          {srv.badge}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                          {srv.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {srv.tagline}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-2.5 pt-1">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Key Deliverables & Capabilities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {srv.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Core Tech Stack & Tools:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.tech.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 text-[11px] font-mono rounded-md bg-muted text-muted-foreground border border-border/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: CTA card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center rounded-xl border border-border/80 bg-muted/30 p-6 sm:p-8 space-y-5">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        Project Scoping
                      </span>
                      <h4 className="text-lg font-bold text-foreground">
                        Request a Proposal for {srv.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Get a detailed technical estimate, milestone breakdown, and dedicated solutions architect assigned to your project.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <Link href={`/services?inquire=${srv.id}#inquiry-form`} className="block w-full">
                        <Button className="w-full rounded-xl font-semibold gap-2 h-10">
                          <span>Get Free Quote for {srv.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Fixed-price or agile sprint billing available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Engineering & Delivery Process */}
      <section className="rounded-2xl border border-border/80 bg-muted/20 p-8 sm:p-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <Badge variant="outline" className="px-3 py-0.5 text-xs font-mono uppercase tracking-wider border-border/70">
            Methodology
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our 4-Step Engineering Process
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every software, website, design, or marketing engagement follows a disciplined, transparent execution cycle designed for predictable success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-foreground/20 transition-colors"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  STEP {step.step}
                </span>
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Service Inquiry / Proposal Request Section */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold rounded-full border">
            <Rocket className="h-3.5 w-3.5 text-primary mr-1.5 inline" /> Fast Response Guaranteed
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Request an IT Service Consultation & Estimate
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Select your service domain, share your project specifications, and our engineering leadership will return a comprehensive proposal with timeline estimates.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 rounded-3xl border animate-pulse bg-muted/40" />}>
          <ServiceInquiryForm />
        </Suspense>
      </section>
    </div>
  );
}
