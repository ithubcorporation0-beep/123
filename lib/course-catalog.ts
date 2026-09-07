export interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  instructor: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  learningOutcomes: string[];
  prerequisites: string[];
  chapters: {
    id: string;
    title: string;
    description: string;
    position: number;
    isFree: boolean;
    duration: string;
    videoUrl?: string;
  }[];
  enrollmentsCount: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export const FALLBACK_COURSES: CourseData[] = [
  {
    id: "course_software_solutions",
    title: "Software Solutions & Enterprise Architecture",
    slug: "software-solutions-enterprise-architecture",
    description:
      "Master enterprise software engineering, scalable multi-tenant SaaS architecture, cloud microservices, REST & GraphQL APIs, and high-performance databases.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_software",
      name: "Software Solutions",
      slug: "software-solutions",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Chief Technology Officer & Enterprise Architect with 15+ years delivering scalable SaaS and cloud systems.",
    },
    learningOutcomes: [
      "Architect multi-tenant SaaS platforms with robust role authorization.",
      "Design and deploy production REST and GraphQL API gateways.",
      "Containerize microservices using Docker and orchestration workflows.",
      "Implement event-driven asynchronous queues and database optimizations.",
    ],
    prerequisites: ["Basic understanding of programming fundamentals."],
    chapters: [
      {
        id: "ch_soft_1",
        title: "1. Enterprise Software Architecture & Design Patterns",
        description: "Understand domain-driven design, clean architecture, and decoupled service layers.",
        position: 1,
        isFree: true,
        duration: "22 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "ch_soft_2",
        title: "2. Scalable APIs, Microservices & Database Sharding",
        description: "Build fault-tolerant APIs with PostgreSQL indexing, Redis caching, and rate limiting.",
        position: 2,
        isFree: false,
        duration: "34 min",
      },
      {
        id: "ch_soft_3",
        title: "3. Cloud Deployment, CI/CD & Security Hardening",
        description: "Automate containerized deployments with automated testing and zero-downtime rollouts.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
    ],
    enrollmentsCount: 1680,
    rating: 4.9,
    reviewsCount: 342,
    isFeatured: true,
  },
  {
    id: "course_website_solutions",
    title: "Website Solutions & Modern Web Development",
    slug: "website-solutions-modern-web-development",
    description:
      "Build blazing-fast, responsive web applications using Next.js 15+, React 19, TypeScript, Tailwind CSS, headless CMS integrations, and Web Core Vitals tuning.",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_website",
      name: "Website Solutions",
      slug: "website-solutions",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_sarah",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Full-Stack Web Architect and Technical Lead specializing in Next.js, modern frontends, and performance.",
    },
    learningOutcomes: [
      "Build high-performance web applications using Next.js App Router.",
      "Achieve 99+ Google Lighthouse scores with Web Core Vitals optimization.",
      "Integrate headless CMS platforms for dynamic client content management.",
      "Deploy scalable corporate portals with responsive mobile-first UI.",
    ],
    prerequisites: ["Familiarity with HTML, CSS, and basic JavaScript."],
    chapters: [
      {
        id: "ch_web_1",
        title: "1. Next.js 15 App Router & Modern Web Architecture",
        description: "Master React Server Components, server actions, dynamic routing, and streaming UI.",
        position: 1,
        isFree: true,
        duration: "25 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "ch_web_2",
        title: "2. Responsive UI Engineering with Tailwind & Glassmorphism",
        description: "Craft modern aesthetic layouts, dark-mode styling, micro-animations, and accessible dialogs.",
        position: 2,
        isFree: false,
        duration: "30 min",
      },
      {
        id: "ch_web_3",
        title: "3. SEO, Web Core Vitals & Production Deployment",
        description: "Optimize metadata, sitemaps, OpenGraph tags, Edge CDN caching, and custom domain setup.",
        position: 3,
        isFree: false,
        duration: "26 min",
      },
    ],
    enrollmentsCount: 1510,
    rating: 4.9,
    reviewsCount: 298,
    isFeatured: true,
  },
  {
    id: "course_digital_marketing",
    title: "Digital Marketing Masterclass & Growth Strategy",
    slug: "digital-marketing-masterclass",
    description:
      "Master modern digital marketing, technical SEO, high-ROI Google & Meta ad campaigns, conversion funnels, and data analytics to scale business revenue.",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_mktg",
      name: "Digital Marketing",
      slug: "digital-marketing",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_alex",
      name: "Alex Rivera",
      email: "alex.rivera@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Marketing Strategist. Expert in brand storytelling, growth funnels, and performance ads.",
    },
    learningOutcomes: [
      "Design high-converting Meta, Facebook, and Google ad campaigns.",
      "Master keyword research, technical SEO, and content funnels.",
      "Calculate customer acquisition costs (CAC) and lifetime value (LTV).",
      "Optimize website landing page conversion rates and retention loops.",
    ],
    prerequisites: ["Basic understanding of web browsing and social media."],
    chapters: [
      {
        id: "ch_mktg_1",
        title: "1. Introduction to Digital Marketing & Growth Funnels",
        description: "Understand customer acquisition channels, lead magnet creation, and digital brand positioning.",
        position: 1,
        isFree: true,
        duration: "18 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "ch_mktg_2",
        title: "2. Search Engine Optimization (SEO) & Content Strategy",
        description: "Learn keyword research, technical SEO, content structuring, and Google ranking algorithms.",
        position: 2,
        isFree: false,
        duration: "24 min",
      },
      {
        id: "ch_mktg_3",
        title: "3. Social Media Ads & Conversion Analytics",
        description: "Design high-converting Facebook, Meta, and Google ad campaigns with real-time ROI tracking.",
        position: 3,
        isFree: false,
        duration: "30 min",
      },
    ],
    enrollmentsCount: 1420,
    rating: 4.9,
    reviewsCount: 312,
    isFeatured: true,
  },
  {
    id: "course_graphic_design",
    title: "Graphic Design & Visual Identity Systems",
    slug: "graphic-design-visual-identity",
    description:
      "Comprehensive guide to visual design hierarchy, brand guidelines, logo creation, UI/UX prototyping in Figma, and high-impact digital collateral.",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_design",
      name: "Graphic Design",
      slug: "graphic-design",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_alex",
      name: "Alex Rivera",
      email: "alex.rivera@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Marketing Strategist. Expert in brand storytelling, graphic design systems, and digital campaigns.",
    },
    learningOutcomes: [
      "Apply fundamental principles of composition, visual hierarchy, and color theory.",
      "Design professional logos, posters, brand books, and marketing collateral.",
      "Master Adobe Illustrator vector tools, typography paths, and icon creation.",
      "Create high-fidelity interactive component libraries and design tokens in Figma.",
    ],
    prerequisites: ["No prior design experience needed."],
    chapters: [
      {
        id: "ch_gd_1",
        title: "1. Fundamentals of Graphic Design & Composition",
        description: "Master visual balance, grid systems, contrast, white space, and color psychology.",
        position: 1,
        isFree: true,
        duration: "15 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      },
      {
        id: "ch_gd_2",
        title: "2. Logo Design & Brand Identity Systems",
        description: "Craft memorable brand logos, color palettes, typography specs, and brand style guides.",
        position: 2,
        isFree: false,
        duration: "25 min",
      },
      {
        id: "ch_gd_3",
        title: "3. Figma UI/UX Design & Digital Media Creative",
        description: "Hands-on vector design, responsive wireframes, design systems, and ad collateral.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
    ],
    enrollmentsCount: 1190,
    rating: 4.8,
    reviewsCount: 224,
    isFeatured: true,
  },
  {
    id: "course_ecommerce_solutions",
    title: "E-Commerce Solutions & High-Converting Storefronts",
    slug: "ecommerce-solutions-high-converting-storefronts",
    description:
      "Engineer and launch full-scale online storefronts, headless commerce integrations, multi-currency payment checkouts, and inventory sync systems.",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_ecommerce",
      name: "E-Commerce Solutions",
      slug: "ecommerce-solutions",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Chief Technology Officer & Enterprise Architect specializing in headless commerce and high-volume checkout.",
    },
    learningOutcomes: [
      "Build custom headless commerce stores with Next.js and Shopify APIs.",
      "Integrate Stripe, PayPal, and Apple Pay payment processing with webhooks.",
      "Implement real-time inventory management and order fulfillment automations.",
      "Optimize checkout funnels to reduce abandoned carts and maximize sales volume.",
    ],
    prerequisites: ["Basic understanding of web technologies."],
    chapters: [
      {
        id: "ch_ecom_1",
        title: "1. E-Commerce Architecture & Headless Storefronts",
        description: "Understand modern commerce stacks, catalog modeling, product variants, and carts.",
        position: 1,
        isFree: true,
        duration: "20 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      },
      {
        id: "ch_ecom_2",
        title: "2. Payment Gateways, Stripe Webhooks & Security",
        description: "Secure payment transactions, PCI compliance, webhook verification, and automated order receipting.",
        position: 2,
        isFree: false,
        duration: "32 min",
      },
      {
        id: "ch_ecom_3",
        title: "3. Inventory Management, Fulfillment & Conversion Optimization",
        description: "Real-time stock alerts, third-party logistics (3PL) webhooks, and conversion rate engineering.",
        position: 3,
        isFree: false,
        duration: "27 min",
      },
    ],
    enrollmentsCount: 1350,
    rating: 4.9,
    reviewsCount: 260,
    isFeatured: true,
  },
];

export function findFallbackCourse(identifier: string): CourseData {
  if (!identifier) return FALLBACK_COURSES[0];
  const cleanId = identifier.trim().toLowerCase();
  const match = FALLBACK_COURSES.find(
    (c) =>
      c.id.toLowerCase() === cleanId ||
      c.slug.toLowerCase() === cleanId ||
      cleanId.includes(c.id.toLowerCase()) ||
      cleanId.includes(c.slug.toLowerCase()) ||
      c.slug.toLowerCase().includes(cleanId)
  );
  return match || FALLBACK_COURSES[0];
}

