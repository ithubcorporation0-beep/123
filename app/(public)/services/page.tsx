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
    tagline: "High-throughput, secure, and maintainable enterprise software engineering.",
    icon: Code2,
    gradient: "from-blue-600/20 via-indigo-600/10 to-violet-600/20",
    badge: "Enterprise & Custom Engineering",
    deliverables: [
      "Custom SaaS platforms with multi-tenant data partitioning",
      "Enterprise Resource Planning (ERP) and internal operational portals",
      "High-concurrency RESTful and GraphQL API backends",
      "Cloud native microservices deployment (AWS, GCP, Cloudflare)",
      "Automated third-party integrations and data migration pipelines",
      "Legacy system refactoring, security audits, and code optimization",
    ],
    tech: ["Node.js", "Python", "Go", "PostgreSQL", "Docker", "Kubernetes", "Redis", "Kafka"],
  },
  {
    id: "website-solutions",
    title: "Website Solutions",
    tagline: "Lightning-fast, search-optimized web applications and corporate websites.",
    icon: Globe,
    gradient: "from-emerald-600/20 via-teal-600/10 to-cyan-600/20",
    badge: "Modern Jamstack & Full-Stack Web",
    deliverables: [
      "Server-rendered Next.js and React web portals",
      "Ultra-responsive mobile-first design with fluid animations",
      "Headless CMS integration (Sanity, Strapi, Contentful)",
      "99+ Google Lighthouse score performance tuning",
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
    gradient: "from-rose-600/20 via-pink-600/10 to-amber-600/20",
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
    gradient: "from-purple-600/20 via-fuchsia-600/10 to-pink-600/20",
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
    gradient: "from-amber-600/20 via-orange-600/10 to-red-600/20",
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Professional IT & Enterprise Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
          Full-Spectrum{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            IT Services
          </span>{" "}
          Built to Scale
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          From mission-critical software systems and blazing-fast web applications to revenue-generating digital marketing, brand design, and e-commerce platforms — we deliver end-to-end technology solutions that empower your business.
        </p>

        {/* Quick Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>100% Production-Grade Code</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>IP Ownership & Full Non-Disclosure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Agile Sprint Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-rose-500" />
            <span>24/7 Technical SLA Support</span>
          </div>
        </div>

        {/* CTA Anchor */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link href="#inquiry-form">
            <Button size="lg" className="rounded-full px-8 font-bold gap-2">
              <span>Request a Custom Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#services-detail">
            <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold">
              Explore All 5 Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Detailed Services Deep Dive */}
      <section id="services-detail" className="space-y-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Our 5 Main IT Service Pillars
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Each service is backed by senior engineers, battle-tested methodologies, and modern technology frameworks.
          </p>
        </div>

        <div className="space-y-12">
          {DETAILED_SERVICES.map((srv, index) => {
            const Icon = srv.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={srv.id}
                id={srv.id}
                className="scroll-mt-28 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-8 sm:p-12 shadow-lg transition-all duration-300 hover:border-primary/40 relative overflow-hidden"
              >
                {/* Ambient glow */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${srv.gradient} rounded-full blur-[100px] pointer-events-none -z-10`}
                />

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  {/* Left/Main Column: Info (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          {srv.badge}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                          {srv.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {srv.tagline}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Key Deliverables & Capabilities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {srv.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Core Tech Stack & Tools:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {srv.tech.map((t, idx) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs font-semibold rounded-lg">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: CTA card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center rounded-2xl border border-border/80 bg-muted/40 p-6 sm:p-8 space-y-5">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Ready to Start?
                      </span>
                      <h4 className="text-xl font-bold text-foreground">
                        Request a Proposal for {srv.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Get a detailed technical estimate, milestone breakdown, and dedicated solutions architect assigned to your project.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <Link href={`/services?inquire=${srv.id}#inquiry-form`} className="block w-full">
                        <Button className="w-full rounded-xl font-bold gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20">
                          <span>Get Free Quote for {srv.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Fixed price or agile sprint billing available</span>
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
      <section className="rounded-3xl border border-border/80 bg-muted/20 p-8 sm:p-14 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border-primary/30">
            Methodology
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Our 4-Step Engineering Process
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every software, website, design, or marketing engagement follows a disciplined, transparent execution cycle designed for predictable success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-2">
                <span className="text-3xl font-black text-primary/40">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
