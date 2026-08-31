import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting realistic LMS database seeding...");

  // 1. Seed Categories
  const categoriesData = [
    {
      name: "Development",
      slug: "development",
      description: "Full-stack web engineering, Next.js, TypeScript, PostgreSQL, and cloud infrastructure.",
    },
    {
      name: "Design",
      slug: "design",
      description: "User experience, Figma design systems, visual hierarchy, and interaction design.",
    },
    {
      name: "Business",
      slug: "business",
      description: "Product discovery, agile development, growth metrics, and leadership strategies.",
    },
    {
      name: "Marketing",
      slug: "marketing",
      description: "SEO optimization, content funnels, developer marketing, and analytics.",
    },
    {
      name: "Photography",
      slug: "photography",
      description: "Digital imaging, studio lighting setups, RAW post-processing, and visual storytelling.",
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const record = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
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
      email: "sarah.chen@eduflow.io",
      name: "Dr. Sarah Chen",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Principal Software Architect and veteran educator. Specializing in modern distributed systems, React server components, and enterprise TypeScript applications.",
    },
    {
      userId: "inst_alex_rivera",
      email: "alex.rivera@eduflow.io",
      name: "Alex Rivera",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Design Systems Lead and Product Designer. Obsessed with building scalable design tokens, WCAG-compliant UI libraries, and micro-interactions in Figma and code.",
    },
    {
      userId: "inst_david_kim",
      email: "david.kim@eduflow.io",
      name: "David Kim",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Cloud & DevOps Specialist. Helping software teams automate deployment pipelines, master Kubernetes orchestrations, and construct zero-downtime microservices.",
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
      userId: "stud_emily_watson",
      email: "emily.watson@student.eduflow.io",
      name: "Emily Watson",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      bio: "Junior Frontend Developer aiming to master full-stack Next.js and backend database architecture.",
    },
    {
      userId: "stud_marcus_vance",
      email: "marcus.vance@student.eduflow.io",
      name: "Marcus Vance",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Product designer leveling up in accessible UI design systems and design engineering.",
    },
    {
      userId: "stud_priya_sharma",
      email: "priya.sharma@student.eduflow.io",
      name: "Priya Sharma",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      bio: "Aspiring Cloud Engineer focused on containerization and automated deployments.",
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

  // 4. Seed Courses with Full Curriculums
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const coursesData = [
    {
      title: "Full-Stack Next.js & TypeScript Architecture",
      slug: "full-stack-nextjs-typescript-architecture",
      description: "Master modern full-stack development using Next.js 15, App Router, React Server Components, Prisma ORM, and PostgreSQL. Learn industry patterns for robust server actions and caching.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "development",
      instructorEmail: "sarah.chen@eduflow.io",
      chapters: [
        {
          title: "Introduction to Next.js App Router & Server Components",
          description: "Understand the fundamentals of React Server Components (RSC), server-side rendering (SSR), and how the App Router optimizes data streaming.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Database Modeling with Prisma & PostgreSQL",
          description: "Design normalized database schemas, implement one-to-many and many-to-many relations, and perform efficient queries using Prisma Client.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Server Actions, Form Mutations & Zod Validation",
          description: "Execute type-safe mutations with Next.js Server Actions, validate client inputs with Zod schemas, and handle optimistic UI updates seamlessly.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Authentication, Role-Based Access & Security Best Practices",
          description: "Implement secure server-side session verification, protect API endpoints, and enforce role-based access control across routes.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 4,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Production Deployment, Performance & Core Web Vitals",
          description: "Optimize Largest Contentful Paint (LCP), configure streaming boundaries, setup edge caching, and deploy on modern cloud platforms.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          position: 5,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Design Systems & Modern UI Engineering with Figma",
      slug: "design-systems-modern-ui-engineering-figma",
      description: "A comprehensive guide to constructing enterprise-grade design systems. Learn design token architecture, accessible color palettes, Figma component variants, and code translation.",
      thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "design",
      instructorEmail: "alex.rivera@eduflow.io",
      chapters: [
        {
          title: "Design Tokens & Foundation Scales",
          description: "Establish mathematical color scales, modular typography hierarchies, and consistent spacing units for scalable product interfaces.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Crafting Accessible Component Libraries in Figma",
          description: "Build atomic UI components including buttons, input fields, modals, and dropdowns with interactive states and WCAG AA contrast compliance.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Dark Mode Theming & CSS Variable Tokens",
          description: "Translate Figma token sets into CSS custom properties, ensuring seamless theme switching between light and dark palettes.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Micro-Interactions & Fluid Animations",
          description: "Implement delightful motion cues, hover transitions, and skeleton loaders to enhance perceived responsiveness.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 4,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Cloud Native Microservices with Docker & Kubernetes",
      slug: "cloud-native-microservices-docker-kubernetes",
      description: "Learn to architect, containerize, and orchestrate resilient microservices in production. Covers Docker multi-stage builds, Kubernetes pods, ingress controllers, and CI/CD pipelines.",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "ADVANCED",
      categorySlug: "development",
      instructorEmail: "david.kim@eduflow.io",
      chapters: [
        {
          title: "Containerization Fundamentals with Docker",
          description: "Write lean, secure Dockerfiles using multi-stage builds, cache layers effectively, and manage multi-container apps with Docker Compose.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Kubernetes Cluster Architecture & Core Primitives",
          description: "Deploy and manage Pods, ReplicaSets, Deployments, and Services in a Kubernetes environment.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Ingress Routing, TLS & Service Meshes",
          description: "Configure NGINX Ingress controllers, automatic SSL/TLS certificate renewal with Let's Encrypt, and service discovery.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Automated CI/CD Pipelines & Zero-Downtime Rollouts",
          description: "Construct GitHub Actions pipelines to run automated tests, build container images, and execute rolling deployments.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          position: 4,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Product Strategy & Agile Growth Loops",
      slug: "product-strategy-agile-growth-loops",
      description: "Accelerate software products from initial discovery to market dominance. Learn user research synthesis, quantitative KPI dashboards, North Star metrics, and growth funnels.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "business",
      instructorEmail: "alex.rivera@eduflow.io",
      chapters: [
        {
          title: "Product Discovery & Validating Market Fit",
          description: "Conduct user problem interviews, synthesize qualitative insights into opportunity trees, and prioritize MVPs.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Defining Product KPIs & Retention Loops",
          description: "Establish North Star metrics, calculate user cohort retention, and distinguish between leading and lagging growth indicators.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "A/B Testing & Funnel Conversion Optimization",
          description: "Design statistically sound A/B test experiments, analyze drop-off rates in onboarding funnels, and iterate quickly.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Professional Studio Photography & RAW Post-Processing",
      slug: "professional-studio-photography-raw-editing",
      description: "Master studio light shaping, manual camera exposure, color calibration, and professional RAW editing in modern post-production pipelines.",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "photography",
      instructorEmail: "david.kim@eduflow.io",
      chapters: [
        {
          title: "Mastering Manual Exposure & Camera Sensor Dynamics",
          description: "Deep dive into shutter speed, aperture, ISO grain, depth-of-field control, and histogram analysis in real-time.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Studio Lighting: Key, Fill, and Rim Light Dynamics",
          description: "Set up softboxes, beauty dishes, reflectors, and continuous LED panels to sculpt subject contours.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "RAW Color Grading & High-Fidelity Exporting",
          description: "Correct white balance shifts, utilize tone curves for contrast control, and color grade skin tones for high-resolution web and print formats.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
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

    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        price: courseData.price,
        isPublished: courseData.isPublished,
        isFeatured: courseData.isFeatured,
        level: courseData.level,
        categoryId: categoryId,
        instructorId: instructorId,
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        price: courseData.price,
        isPublished: courseData.isPublished,
        isFeatured: courseData.isFeatured,
        level: courseData.level,
        categoryId: categoryId,
        instructorId: instructorId,
      },
    });

    console.log(`✓ Course: ${course.title}`);

    // Seed chapters for this course
    for (const chap of courseData.chapters) {
      // Find existing chapter by courseId and position
      const existingChap = await prisma.chapter.findFirst({
        where: {
          courseId: course.id,
          position: chap.position,
        },
      });

      let chapterRecord;
      if (existingChap) {
        chapterRecord = await prisma.chapter.update({
          where: { id: existingChap.id },
          data: {
            title: chap.title,
            description: chap.description,
            videoUrl: chap.videoUrl,
            isPublished: chap.isPublished,
            isFree: chap.isFree,
          },
        });
      } else {
        chapterRecord = await prisma.chapter.create({
          data: {
            title: chap.title,
            description: chap.description,
            videoUrl: chap.videoUrl,
            position: chap.position,
            isPublished: chap.isPublished,
            isFree: chap.isFree,
            courseId: course.id,
          },
        });
      }

      console.log(`  - Chapter ${chap.position}: ${chapterRecord.title}`);
    }
  }

  // 5. Seed Real Enrollments & Progress for authentic student analytics
  console.log("\nSeeding realistic student enrollments & progression tracking...");

  const allCourses = await prisma.course.findMany({
    include: {
      chapters: {
        orderBy: { position: "asc" },
      },
    },
  });

  const studentProfiles = await prisma.profile.findMany({
    where: { role: Role.student },
  });

  for (const student of studentProfiles) {
    // Enroll in the first 2 courses
    for (let i = 0; i < Math.min(2, allCourses.length); i++) {
      const course = allCourses[i];

      const enrollment = await prisma.enrollment.upsert({
        where: {
          profileId_courseId: {
            profileId: student.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          profileId: student.id,
          courseId: course.id,
        },
      });

      // Complete the first chapter for this student
      if (course.chapters.length > 0) {
        const firstChapter = course.chapters[0];
        await prisma.userProgress.upsert({
          where: {
            profileId_chapterId: {
              profileId: student.id,
              chapterId: firstChapter.id,
            },
          },
          update: {
            isCompleted: true,
          },
          create: {
            profileId: student.id,
            chapterId: firstChapter.id,
            isCompleted: true,
          },
        });
      }

      console.log(`✓ Enrolled ${student.name} in "${course.title}"`);
    }
  }

  console.log("\nSeeding completed successfully! The database is now populated with real LMS data.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
