import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding exact user requested 5 courses & categories...");

  // Clear previous data to ensure ONLY the 5 requested courses exist
  await prisma.userProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.courseCategory.deleteMany({});

  // 1. Seed Categories for the 5 requested courses
  const categoriesData = [
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "SEO optimization, social media funnels, performance marketing, and ad analytics.",
    },
    {
      name: "Graphic Design",
      slug: "graphic-design",
      description: "Visual design hierarchy, brand identity, Photoshop, Illustrator, and typography.",
    },
    {
      name: "AI Agentic Course",
      slug: "ai-agentic",
      description: "Autonomous AI agents, LLM tool-calling, multi-agent frameworks, and prompt engineering.",
    },
    {
      name: "Computer Course",
      slug: "computer-course",
      description: "Computer fundamentals, operating systems, hardware architecture, and software logic.",
    },
    {
      name: "IT Course",
      slug: "it-course",
      description: "IT administration, cloud networking, system security, and server management.",
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
      email: "sarah.chen@eduflow.io",
      name: "Dr. Sarah Chen",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "AI Systems Specialist and Senior Instructor. Specializing in autonomous agent architectures and intelligent automation.",
    },
    {
      userId: "inst_alex_rivera",
      email: "alex.rivera@eduflow.io",
      name: "Alex Rivera",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Marketing Strategist. Expert in brand storytelling, graphic design systems, and digital campaigns.",
    },
    {
      userId: "inst_david_kim",
      email: "david.kim@eduflow.io",
      name: "David Kim",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "IT Infrastructure & Computer Systems Lead. Decades of enterprise network administration and hardware architecture experience.",
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
      bio: "Ambitious learner mastering AI agents and digital marketing growth strategies.",
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

  // 4. Seed EXACTLY 5 Requested Courses
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const coursesData = [
    {
      title: "Digital Marketing Masterclass",
      slug: "digital-marketing-masterclass",
      description: "Master modern digital marketing strategies, SEO optimization, social media ad funnels, content marketing, and conversion rate analytics.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "digital-marketing",
      instructorEmail: "alex.rivera@eduflow.io",
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
      title: "Graphic Design & Visual Identity",
      slug: "graphic-design-visual-identity",
      description: "Comprehensive guide to graphic design principles, color theory, typography, branding assets, Photoshop retouching, and Illustrator vector graphics.",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "graphic-design",
      instructorEmail: "alex.rivera@eduflow.io",
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
          title: "Adobe Illustrator & Photoshop Essentials",
          description: "Hands-on vector illustration, photo manipulation, vector shapes, and poster layouts.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "AI Agentic Course: Building Autonomous Systems",
      slug: "ai-agentic-course-building-autonomous-systems",
      description: "Build cutting-edge AI agents using LLMs, tool orchestration, multi-agent frameworks, autonomous goal execution, and memory management.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "ai-agentic",
      instructorEmail: "sarah.chen@eduflow.io",
      chapters: [
        {
          title: "Introduction to Agentic AI & Tool-Calling LLMs",
          description: "Understand the transition from passive chat models to autonomous, goal-driven AI agents.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Multi-Agent Systems & Tool Orchestration",
          description: "Implement multi-agent team roles, stateful graph execution, and web tool integrations.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Deploying Autonomous Agents to Production",
          description: "Build secure memory stores, task loops, safety guardrails, and cloud deployment pipelines.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Computer Course: Essentials & Operating Systems",
      slug: "computer-course-essentials-operating-systems",
      description: "Master computer fundamentals, hardware architecture, operating system management, file systems, binary logic, and software utilities.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "computer-course",
      instructorEmail: "david.kim@eduflow.io",
      chapters: [
        {
          title: "Computer Basics, CPU, RAM & Hardware Architecture",
          description: "Learn how computers process information, memory hierarchies, storage drives, and peripherals.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Operating Systems (Windows & Linux) & File Management",
          description: "Navigate OS shells, file permission hierarchies, process managers, and system utilities.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Software Productivity Tools & Basic Troubleshooting",
          description: "Essential desktop applications, office suites, diagnostic commands, and system maintenance.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "IT Course: Networking & Cloud Systems Administration",
      slug: "it-course-networking-cloud-systems-administration",
      description: "Comprehensive IT course covering computer networking, TCP/IP, router configuration, cloud administration, cybersecurity basics, and server management.",
      thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "it-course",
      instructorEmail: "david.kim@eduflow.io",
      chapters: [
        {
          title: "IT Fundamentals & Computer Networking Essentials",
          description: "Understand TCP/IP, IP addressing, DNS, subnets, routers, switches, and network topologies.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Server Administration & Active Directory Security",
          description: "Manage domain controllers, user credentials, server roles, and network security policies.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Cloud Infrastructure & Cybersecurity Best Practices",
          description: "Configure cloud virtual networks, firewalls, data backup routines, and incident response protocols.",
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
        categoryId: categoryId,
        instructorId: instructorId,
      },
    });

    console.log(`✓ Course Created: ${course.title}`);

    for (const chap of courseData.chapters) {
      await prisma.chapter.create({
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
      console.log(`  - Chapter ${chap.position}: ${chap.title}`);
    }
  }

  // Enroll student profile
  const student = await prisma.profile.findFirst({ where: { role: Role.student } });
  const firstCourse = await prisma.course.findFirst({ include: { chapters: true } });

  if (student && firstCourse) {
    await prisma.enrollment.create({
      data: {
        profileId: student.id,
        courseId: firstCourse.id,
      },
    });
    if (firstCourse.chapters.length > 0) {
      await prisma.userProgress.create({
        data: {
          profileId: student.id,
          chapterId: firstCourse.chapters[0].id,
          isCompleted: true,
        },
      });
    }
  }

  console.log("\nSuccessfully seeded ONLY the 5 requested courses!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
