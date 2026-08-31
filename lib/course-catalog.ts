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
    id: "course_nextjs",
    title: "Full-Stack Next.js & TypeScript Architecture",
    slug: "full-stack-nextjs-typescript-architecture",
    description:
      "Master production-grade full-stack web engineering using Next.js App Router, React 19, TypeScript, PostgreSQL, and modern Cloudflare / Vercel serverless architectures.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_dev",
      name: "Development",
      slug: "development",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_sarah",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Principal Systems Architect with 12+ years of experience leading distributed systems, Next.js scaling, and TypeScript engineering teams.",
    },
    learningOutcomes: [
      "Architect and deploy full-stack Next.js applications using React Server Components.",
      "Design resilient relational database models with PostgreSQL and Prisma ORM.",
      "Implement secure multi-role authentication (Admin, Instructor, Student) with Clerk.",
      "Optimize web vitals, caching layers, edge middlewares, and server actions for high-concurrency production.",
    ],
    prerequisites: [
      "Basic understanding of JavaScript / ES6 and React fundamentals.",
      "Familiarity with HTML, CSS, and web browser devtools.",
    ],
    chapters: [
      {
        id: "ch_nextjs_1",
        title: "1. Next.js Foundations & Server Component Architecture",
        description:
          "Deep dive into the App Router, Server vs Client boundary, Turbopack, and hybrid rendering strategies.",
        position: 1,
        isFree: true,
        duration: "18 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "ch_nextjs_2",
        title: "2. Type-Safe Data Layer with PostgreSQL & Prisma",
        description:
          "Building relational models, migrations, connection pooling, and optimized query pipelines.",
        position: 2,
        isFree: false,
        duration: "24 min",
      },
      {
        id: "ch_nextjs_3",
        title: "3. Multi-Role Authentication & Access Control",
        description:
          "Integrating Clerk authentication, edge middleware protection, and server-side RBAC authorization.",
        position: 3,
        isFree: false,
        duration: "30 min",
      },
      {
        id: "ch_nextjs_4",
        title: "4. Building High-Performance Interactive Video Players",
        description:
          "Video streaming integration with Mux, progress tracking, and client playback telemetry.",
        position: 4,
        isFree: false,
        duration: "22 min",
      },
      {
        id: "ch_nextjs_5",
        title: "5. Production Deployment, Edge Middleware & Performance",
        description:
          "Zero-downtime deployment pipelines, Cloudflare / Vercel configurations, and Core Web Vitals optimization.",
        position: 5,
        isFree: false,
        duration: "35 min",
      },
    ],
    enrollmentsCount: 1420,
    rating: 4.9,
    reviewsCount: 312,
    isFeatured: true,
  },
  {
    id: "course_design",
    title: "Design Systems & Modern UI Engineering with Figma",
    slug: "design-systems-modern-ui-engineering-figma",
    description:
      "A comprehensive masterclass on constructing enterprise design systems with Figma variables, tokens, and accessible Tailwind CSS & React code components.",
    thumbnail:
      "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_design",
      name: "Design",
      slug: "design",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_alex",
      name: "Alex Rivera",
      email: "alex.rivera@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Product Design Lead & Design Technologist specialized in UI token synchronization, design systems, and inclusive digital accessibility.",
    },
    learningOutcomes: [
      "Create reusable design tokens and variable modes in Figma for dark mode and multi-theme branding.",
      "Translate Figma component variants into accessible React and Tailwind CSS UI components.",
      "Audit and enforce WCAG 2.2 AA accessibility standards for color contrast, focus states, and screen readers.",
      "Document and publish a live component storybook for cross-functional engineering teams.",
    ],
    prerequisites: [
      "Basic understanding of user interfaces and web design.",
      "No coding background required for the Figma track.",
    ],
    chapters: [
      {
        id: "ch_design_1",
        title: "1. Design Tokens, Color Palettes & Typography Scales",
        description:
          "Establishing foundational design tokens, harmonious color spaces, and proportional typography scales.",
        position: 1,
        isFree: true,
        duration: "15 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "ch_design_2",
        title: "2. Auto-Layout Mastery & Responsive Figma Components",
        description:
          "Building dynamic, resilient UI cards, navigation headers, and modal dialogs in Figma.",
        position: 2,
        isFree: false,
        duration: "25 min",
      },
      {
        id: "ch_design_3",
        title: "3. Bridging Figma Tokens to Tailwind CSS & Radix UI",
        description:
          "Exporting token variables into CSS custom properties and wiring accessible component primitives.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
      {
        id: "ch_design_4",
        title: "4. Accessibility (a11y) & Interactive Micro-Animations",
        description:
          "Keyboard navigation, focus rings, ARIA roles, and smooth CSS transitions.",
        position: 4,
        isFree: false,
        duration: "20 min",
      },
    ],
    enrollmentsCount: 980,
    rating: 4.8,
    reviewsCount: 184,
    isFeatured: true,
  },
  {
    id: "course_cloud",
    title: "Cloud Native Microservices with Docker & Kubernetes",
    slug: "cloud-native-microservices-docker-kubernetes",
    description:
      "Learn to architect, containerize, and orchestrate resilient microservices with Docker, Kubernetes, automated CI/CD pipelines, and health monitoring.",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_dev",
      name: "Development",
      slug: "development",
    },
    level: "Advanced",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "DevOps & Cloud Solutions Architect specialized in Kubernetes cluster operations, zero-trust cloud infrastructure, and CI/CD pipelines.",
    },
    learningOutcomes: [
      "Containerize applications with multi-stage Docker builds to reduce image footprint and security vulnerabilities.",
      "Deploy and manage scalable workloads on Kubernetes using Deployments, Services, and Ingress controllers.",
      "Implement automated blue-green and canary release pipelines using GitHub Actions.",
      "Set up distributed tracing, Prometheus metrics, and Grafana dashboard alerts.",
    ],
    prerequisites: [
      "Comfort with Linux terminal and command-line interfaces.",
      "Basic understanding of client-server networking and HTTP protocols.",
    ],
    chapters: [
      {
        id: "ch_cloud_1",
        title: "1. Containerization Principles & Multi-Stage Dockerfiles",
        description:
          "Optimizing container layers, security non-root users, and caching strategies.",
        position: 1,
        isFree: true,
        duration: "20 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "ch_cloud_2",
        title: "2. Kubernetes Core Objects: Pods, Deployments & Services",
        description:
          "Configuring declarative YAML manifests, replica sets, and cluster networking.",
        position: 2,
        isFree: false,
        duration: "32 min",
      },
      {
        id: "ch_cloud_3",
        title: "3. Ingress Routing, TLS Encryption & Auto-Scaling",
        description:
          "Setting up NGINX Ingress, Let's Encrypt automated certs, and Horizontal Pod Autoscalers (HPA).",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
      {
        id: "ch_cloud_4",
        title: "4. GitOps Pipelines & Continuous Deployment",
        description:
          "Automating deployment triggers, rollback policies, and environment config maps.",
        position: 4,
        isFree: false,
        duration: "30 min",
      },
    ],
    enrollmentsCount: 840,
    rating: 4.9,
    reviewsCount: 145,
    isFeatured: true,
  },
  {
    id: "course_biz",
    title: "Product Management & Growth Strategy for Tech Leaders",
    slug: "product-management-growth-strategy",
    description:
      "A strategic roadmap for product leaders: customer discovery, data-driven prioritization frameworks, product-led growth loops, and monetization models.",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_biz",
      name: "Business",
      slug: "business",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_sarah",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Former Head of Product and Tech Advisor to high-growth startups across North America and Europe.",
    },
    learningOutcomes: [
      "Apply RICE and Kano prioritization frameworks to manage product backlogs effectively.",
      "Design and execute continuous customer discovery interviews and usability tests.",
      "Build viral product-led growth (PLG) loops that accelerate user retention and onboarding.",
      "Construct actionable KPI metric trees to align product delivery with core business revenue.",
    ],
    prerequisites: [
      "Interest in product strategy, software development, or tech startups.",
    ],
    chapters: [
      {
        id: "ch_biz_1",
        title: "1. Customer Problem Definition & Market Opportunity Sizing",
        description:
          "Validating assumptions, total addressable market (TAM), and competitive landscape analysis.",
        position: 1,
        isFree: true,
        duration: "18 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
      {
        id: "ch_biz_2",
        title: "2. Strategic Prioritization & Roadmapping Frameworks",
        description:
          "Balancing technical debt, feature requests, and business-critical deliverables.",
        position: 2,
        isFree: false,
        duration: "24 min",
      },
      {
        id: "ch_biz_3",
        title: "3. Product-Led Growth, Retention & Viral Loops",
        description:
          "Optimizing time-to-value (TTV), friction-free onboarding, and activation funnels.",
        position: 3,
        isFree: false,
        duration: "26 min",
      },
    ],
    enrollmentsCount: 650,
    rating: 4.7,
    reviewsCount: 92,
    isFeatured: false,
  },
  {
    id: "course_photo",
    title: "Commercial Photography & Lighting Masterclass",
    slug: "commercial-photography-lighting-masterclass",
    description:
      "Master studio strobe lighting, three-point portrait setups, product staging, camera color profiles, and high-end Adobe Lightroom/Photoshop workflows.",
    thumbnail:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_photo",
      name: "Photography",
      slug: "photography",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_alex",
      name: "Alex Rivera",
      email: "alex.rivera@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Editorial & Commercial Photographer published in global design magazines and digital campaigns.",
    },
    learningOutcomes: [
      "Master light modifiers (softboxes, beauty dishes, grids, and reflectors) for commercial imagery.",
      "Configure camera exposure triangles, custom white balances, and color calibration targets.",
      "Execute professional studio product and portrait shoots with high visual impact.",
      "Perform non-destructive frequency separation and color grading in Adobe Photoshop.",
    ],
    prerequisites: [
      "Access to any DSLR, mirrorless camera, or advanced manual mobile camera app.",
    ],
    chapters: [
      {
        id: "ch_photo_1",
        title: "1. The Physics of Light & Quality Modifiers",
        description:
          "Hard light vs soft light, inverse-square law, and controlling light falloff.",
        position: 1,
        isFree: true,
        duration: "16 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
      {
        id: "ch_photo_2",
        title: "2. Three-Point Studio Lighting for Editorial Portraits",
        description:
          "Key light, fill light, rim light, and background separation techniques.",
        position: 2,
        isFree: false,
        duration: "28 min",
      },
      {
        id: "ch_photo_3",
        title: "3. Non-Destructive Retouching & Color Grading",
        description:
          "RAW development in Lightroom, selective hue curve adjustments, and export sharpening.",
        position: 3,
        isFree: false,
        duration: "25 min",
      },
    ],
    enrollmentsCount: 520,
    rating: 4.8,
    reviewsCount: 78,
    isFeatured: false,
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
