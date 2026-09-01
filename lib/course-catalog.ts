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
    id: "course_digital_marketing",
    title: "Digital Marketing Masterclass",
    slug: "digital-marketing-masterclass",
    description:
      "Master modern digital marketing strategies, SEO optimization, social media ad funnels, content marketing, and conversion rate analytics.",
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
      email: "alex.rivera@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Marketing Strategist. Expert in brand storytelling, graphic design systems, and digital campaigns.",
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
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    title: "Graphic Design & Visual Identity",
    slug: "graphic-design-visual-identity",
    description:
      "Comprehensive guide to graphic design principles, color theory, typography, branding assets, Photoshop retouching, and Illustrator vector graphics.",
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
      email: "alex.rivera@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Product Design Lead & Visual Brand Architect specialized in brand identities and digital artwork.",
    },
    learningOutcomes: [
      "Apply fundamental principles of composition, visual hierarchy, and color theory.",
      "Design professional logos, posters, brand books, and marketing collateral.",
      "Master Adobe Illustrator vector tools, typography paths, and icon creation.",
      "Perform high-resolution photo manipulation and color grading in Photoshop.",
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
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
        title: "3. Adobe Illustrator & Photoshop Essentials",
        description: "Hands-on vector illustration, photo manipulation, vector shapes, and poster layouts.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
    ],
    enrollmentsCount: 980,
    rating: 4.8,
    reviewsCount: 184,
    isFeatured: true,
  },
  {
    id: "course_ai_agentic",
    title: "AI Agentic Course: Building Autonomous Systems",
    slug: "ai-agentic-course-building-autonomous-systems",
    description:
      "Build cutting-edge AI agents using LLMs, tool orchestration, multi-agent frameworks, autonomous goal execution, and memory management.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_ai",
      name: "AI Agentic Course",
      slug: "ai-agentic",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_sarah",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "AI Systems Specialist and Senior Instructor. Specializing in autonomous agent architectures and intelligent automation.",
    },
    learningOutcomes: [
      "Understand the transition from passive chat models to autonomous, goal-driven AI agents.",
      "Build multi-agent teams with specialized roles and tool execution loops.",
      "Integrate vector memory databases, state graphs, and external API tool calling.",
      "Deploy safe, robust AI agentic pipelines with evaluation benchmarks.",
    ],
    prerequisites: ["Basic familiarity with programming logic or Python/JS."],
    chapters: [
      {
        id: "ch_ai_1",
        title: "1. Introduction to Agentic AI & Tool-Calling LLMs",
        description: "Understand the transition from passive chat models to autonomous, goal-driven AI agents.",
        position: 1,
        isFree: true,
        duration: "20 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "ch_ai_2",
        title: "2. Multi-Agent Systems & Tool Orchestration",
        description: "Implement multi-agent team roles, stateful graph execution, and web tool integrations.",
        position: 2,
        isFree: false,
        duration: "32 min",
      },
      {
        id: "ch_ai_3",
        title: "3. Deploying Autonomous Agents to Production",
        description: "Build secure memory stores, task loops, safety guardrails, and cloud deployment pipelines.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
    ],
    enrollmentsCount: 840,
    rating: 4.9,
    reviewsCount: 145,
    isFeatured: true,
  },
  {
    id: "course_computer",
    title: "Computer Course: Essentials & Operating Systems",
    slug: "computer-course-essentials-operating-systems",
    description:
      "Master computer fundamentals, hardware architecture, operating system management, file systems, binary logic, and software utilities.",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_comp",
      name: "Computer Course",
      slug: "computer-course",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "IT Infrastructure & Computer Systems Lead with decades of hardware and software experience.",
    },
    learningOutcomes: [
      "Understand CPU architecture, RAM, storage devices, and motherboard components.",
      "Master Windows and Linux operating system navigation and file structures.",
      "Troubleshoot hardware issues, driver installations, and system performance.",
      "Use command-line shells and core software utilities effectively.",
    ],
    prerequisites: ["No prerequisites. Ideal for beginners."],
    chapters: [
      {
        id: "ch_comp_1",
        title: "1. Computer Basics, CPU, RAM & Hardware Architecture",
        description: "Learn how computers process information, memory hierarchies, storage drives, and peripherals.",
        position: 1,
        isFree: true,
        duration: "18 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
      {
        id: "ch_comp_2",
        title: "2. Operating Systems (Windows & Linux) & File Management",
        description: "Navigate OS shells, file permission hierarchies, process managers, and system utilities.",
        position: 2,
        isFree: false,
        duration: "24 min",
      },
      {
        id: "ch_comp_3",
        title: "3. Software Productivity Tools & Basic Troubleshooting",
        description: "Essential desktop applications, office suites, diagnostic commands, and system maintenance.",
        position: 3,
        isFree: false,
        duration: "26 min",
      },
    ],
    enrollmentsCount: 650,
    rating: 4.7,
    reviewsCount: 92,
    isFeatured: true,
  },
  {
    id: "course_it",
    title: "IT Course: Networking & Cloud Systems Administration",
    slug: "it-course-networking-cloud-systems-administration",
    description:
      "Comprehensive IT course covering computer networking, TCP/IP, router configuration, cloud administration, cybersecurity basics, and server management.",
    thumbnail:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_it",
      name: "IT Course",
      slug: "it-course",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@eduflow.internal",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Senior Cloud & Network Systems Administrator.",
    },
    learningOutcomes: [
      "Understand TCP/IP protocols, IP addressing, DNS, DHCP, and subnets.",
      "Configure switches, routers, firewalls, and secure local area networks.",
      "Manage Active Directory, user permissions, and Windows/Linux server roles.",
      "Implement cloud network security, backup solutions, and IT troubleshooting.",
    ],
    prerequisites: ["Basic computer skills."],
    chapters: [
      {
        id: "ch_it_1",
        title: "1. IT Fundamentals & Computer Networking Essentials",
        description: "Understand TCP/IP, IP addressing, DNS, subnets, routers, switches, and network topologies.",
        position: 1,
        isFree: true,
        duration: "16 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
      {
        id: "ch_it_2",
        title: "2. Server Administration & Active Directory Security",
        description: "Manage domain controllers, user credentials, server roles, and network security policies.",
        position: 2,
        isFree: false,
        duration: "28 min",
      },
      {
        id: "ch_it_3",
        title: "3. Cloud Infrastructure & Cybersecurity Best Practices",
        description: "Configure cloud virtual networks, firewalls, data backup routines, and incident response protocols.",
        position: 3,
        isFree: false,
        duration: "25 min",
      },
    ],
    enrollmentsCount: 520,
    rating: 4.8,
    reviewsCount: 78,
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
