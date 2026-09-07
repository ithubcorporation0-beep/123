import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding exact 5 core IT services & programs...");

  // Clear previous data to ensure ONLY the 5 requested services/courses exist
  await prisma.userProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.courseCategory.deleteMany({});

  // 1. Seed Categories for the 5 requested IT Services
  const categoriesData = [
    {
      name: "Software Solutions",
      slug: "software-solutions",
      description: "Enterprise software architecture, scalable SaaS products, APIs, and cloud microservices.",
    },
    {
      name: "Website Solutions",
      slug: "website-solutions",
      description: "Modern web engineering, Next.js applications, responsive portals, and headless CMS.",
    },
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "SEO optimization, Google & Meta ad campaigns, growth funnels, and performance marketing.",
    },
    {
      name: "Graphic Design",
      slug: "graphic-design",
      description: "Brand identity systems, UI/UX prototyping in Figma, vector art, and creative media.",
    },
    {
      name: "E-Commerce Solutions",
      slug: "ecommerce-solutions",
      description: "High-converting online storefronts, Shopify & headless engines, and payment integrations.",
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const record = await prisma.courseCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryMap[cat.slug] = record.id;
    console.log(`✓ Category: ${record.name}`);
  }

  // 2. Seed Instructors
  const instructorsData = [
    {
      userId: "inst_sarah_chen",
      email: "sarah.chen@izba.app",
      name: "Dr. Sarah Chen",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Full-Stack Web Architect and Technical Lead specializing in Next.js, modern frontends, and performance.",
    },
    {
      userId: "inst_alex_rivera",
      email: "alex.rivera@izba.app",
      name: "Alex Rivera",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Marketing Strategist. Expert in brand storytelling, graphic design systems, and digital campaigns.",
    },
    {
      userId: "inst_david_kim",
      email: "david.kim@izba.app",
      name: "David Kim",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Chief Technology Officer & Enterprise Architect with 15+ years delivering scalable SaaS, e-commerce, and cloud systems.",
    },
  ];

  const instructorMap: Record<string, string> = {};

  for (const inst of instructorsData) {
    const profile = await prisma.profile.upsert({
      where: { email: inst.email },
      update: {
        name: inst.name,
        role: inst.role,
        imageUrl: inst.imageUrl,
        bio: inst.bio,
      },
      create: {
        userId: inst.userId,
        email: inst.email,
        name: inst.name,
        role: inst.role,
        imageUrl: inst.imageUrl,
        bio: inst.bio,
      },
    });
    instructorMap[inst.email] = profile.id;
    console.log(`✓ Instructor: ${profile.name}`);
  }

  // 3. Seed Students
  const studentsData = [
    {
      userId: "student_emily_clark",
      email: "emily.clark@student.izba.app",
      name: "Emily Clark",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      bio: "Aspiring software engineer.",
    },
    {
      userId: "student_marcus_vance",
      email: "marcus.vance@student.izba.app",
      name: "Marcus Vance",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Digital entrepreneur and UI designer.",
    },
  ];

  const studentMap: Record<string, string> = {};

  for (const stud of studentsData) {
    const profile = await prisma.profile.upsert({
      where: { email: stud.email },
      update: {
        name: stud.name,
        role: stud.role,
        imageUrl: stud.imageUrl,
        bio: stud.bio,
      },
      create: {
        userId: stud.userId,
        email: stud.email,
        name: stud.name,
        role: stud.role,
        imageUrl: stud.imageUrl,
        bio: stud.bio,
      },
    });
    studentMap[stud.email] = profile.id;
    console.log(`✓ Student: ${profile.name}`);
  }

  // 4. Seed EXACTLY 5 IT Services Programs
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const coursesData = [
    {
      title: "Software Solutions & Enterprise Architecture",
      slug: "software-solutions-enterprise-architecture",
      description: "Master enterprise software engineering, scalable multi-tenant SaaS architecture, cloud microservices, REST & GraphQL APIs, and high-performance databases.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "software-solutions",
      instructorEmail: "david.kim@izba.app",
      chapters: [
        {
          title: "Enterprise Software Architecture & Design Patterns",
          description: "Understand domain-driven design, clean architecture, and decoupled service layers.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Scalable APIs, Microservices & Database Sharding",
          description: "Build fault-tolerant APIs with PostgreSQL indexing, Redis caching, and rate limiting.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Cloud Deployment, CI/CD & Security Hardening",
          description: "Automate containerized deployments with automated testing and zero-downtime rollouts.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Website Solutions & Modern Web Development",
      slug: "website-solutions-modern-web-development",
      description: "Build blazing-fast, responsive web applications using Next.js 15+, React 19, TypeScript, Tailwind CSS, headless CMS integrations, and Web Core Vitals tuning.",
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "website-solutions",
      instructorEmail: "sarah.chen@izba.app",
      chapters: [
        {
          title: "Next.js 15 App Router & Modern Web Architecture",
          description: "Master React Server Components, server actions, dynamic routing, and streaming UI.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Responsive UI Engineering with Tailwind & Glassmorphism",
          description: "Craft modern aesthetic layouts, dark-mode styling, micro-animations, and accessible dialogs.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "SEO, Web Core Vitals & Production Deployment",
          description: "Optimize metadata, sitemaps, OpenGraph tags, Edge CDN caching, and custom domain setup.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Digital Marketing Masterclass & Growth Strategy",
      slug: "digital-marketing-masterclass",
      description: "Master modern digital marketing strategies, SEO optimization, social media ad funnels, content marketing, and conversion rate analytics.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "digital-marketing",
      instructorEmail: "alex.rivera@izba.app",
      chapters: [
        {
          title: "Introduction to Digital Marketing & Growth Funnels",
          description: "Understand customer acquisition channels, lead magnet creation, and digital brand positioning.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Search Engine Optimization (SEO) & Content Strategy",
          description: "Learn keyword research, technical SEO, content structuring, and Google ranking algorithms.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Social Media Ads & Conversion Analytics",
          description: "Design high-converting Facebook, Meta, and Google ad campaigns with real-time ROI tracking.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Graphic Design & Visual Identity Systems",
      slug: "graphic-design-visual-identity",
      description: "Comprehensive guide to graphic design principles, color theory, typography, branding assets, Photoshop retouching, and Illustrator vector graphics.",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "graphic-design",
      instructorEmail: "alex.rivera@izba.app",
      chapters: [
        {
          title: "Fundamentals of Graphic Design & Composition",
          description: "Master visual balance, grid systems, contrast, white space, and color psychology.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Logo Design & Brand Identity Systems",
          description: "Craft memorable brand logos, color palettes, typography specs, and brand style guides.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Figma UI/UX Design & Digital Media Creative",
          description: "Hands-on vector design, responsive wireframes, design systems, and ad collateral.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "E-Commerce Solutions & High-Converting Storefronts",
      slug: "ecommerce-solutions-high-converting-storefronts",
      description: "Engineer and launch full-scale online storefronts, headless commerce integrations, multi-currency payment checkouts, and inventory sync systems.",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "ecommerce-solutions",
      instructorEmail: "david.kim@izba.app",
      chapters: [
        {
          title: "E-Commerce Architecture & Headless Storefronts",
          description: "Understand modern commerce stacks, catalog modeling, product variants, and carts.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Payment Gateways, Stripe Webhooks & Security",
          description: "Secure payment transactions, PCI compliance, webhook verification, and automated order receipting.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Inventory Management, Fulfillment & Conversion Optimization",
          description: "Real-time stock alerts, third-party logistics (3PL) webhooks, and conversion rate engineering.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
  ];

  for (const courseData of coursesData) {
    const instructorId = instructorMap[courseData.instructorEmail];
    const categoryId = categoryMap[courseData.categorySlug];

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        price: courseData.price,
        isPublished: courseData.isPublished,
        isFeatured: courseData.isFeatured,
        level: courseData.level,
        instructorId: instructorId,
        categoryId: categoryId,
        chapters: {
          create: courseData.chapters.map((ch) => ({
            title: ch.title,
            description: ch.description,
            videoUrl: ch.videoUrl,
            position: ch.position,
            isPublished: ch.isPublished,
            isFree: ch.isFree,
          })),
        },
      },
    });

    console.log(`✓ Course: ${course.title} (${course.slug})`);

    // Enroll students into published courses with initial progress
    for (const [studentEmail, studentId] of Object.entries(studentMap)) {
      await prisma.enrollment.create({
        data: {
          profileId: studentId,
          courseId: course.id,
        },
      });

      const firstChapter = await prisma.chapter.findFirst({
        where: { courseId: course.id, position: 1 },
      });

      if (firstChapter) {
        await prisma.userProgress.create({
          data: {
            profileId: studentId,
            chapterId: firstChapter.id,
            isCompleted: true,
          },
        });
      }
    }
  }

  console.log("Seeding finished successfully with 5 core IT services!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
