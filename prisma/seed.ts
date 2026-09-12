import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding authentic educational learning catalog...");

  // Clear previous data
  await prisma.userProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.courseCategory.deleteMany({});

  // 1. Seed Categories for Educational Learning Disciplines
  const categoriesData = [
    {
      name: "Business & Leadership",
      slug: "business-leadership",
      description: "Executive strategy, organizational leadership, team management, and entrepreneurship.",
    },
    {
      name: "Design & Creative Arts",
      slug: "design-creative-arts",
      description: "Visual arts, graphic design, creative typography, digital illustration, and design thinking.",
    },
    {
      name: "Science & Technology",
      slug: "science-technology",
      description: "Data science, statistical reasoning, scientific methods, and quantitative problem solving.",
    },
    {
      name: "Communication & Languages",
      slug: "communication-languages",
      description: "Public speaking, persuasive storytelling, interpersonal communication, and rhetoric.",
    },
    {
      name: "Finance & Economics",
      slug: "finance-economics",
      description: "Personal finance, budgeting, investment fundamentals, economics, and wealth building.",
    },
    {
      name: "Personal Development",
      slug: "personal-development",
      description: "Mindfulness, cognitive performance, habit formation, emotional intelligence, and well-being.",
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
      userId: "inst_david_kim",
      email: "david.kim@izba.app",
      name: "Prof. David Kim",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Executive Coach & Management Educator with 15+ years guiding organizational leaders.",
    },
    {
      userId: "inst_alex_rivera",
      email: "alex.rivera@izba.app",
      name: "Alex Rivera",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Visual Arts Educator passionate about unlocking creative potential in learners.",
    },
    {
      userId: "inst_sarah_chen",
      email: "sarah.chen@izba.app",
      name: "Dr. Sarah Chen",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Associate Professor of Computational Science dedicated to making quantitative thinking accessible.",
    },
    {
      userId: "inst_elena_rostova",
      email: "elena.rostova@izba.app",
      name: "Elena Rostova",
      role: Role.instructor,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      bio: "Keynote Speaker & Communication Coach who has mentored over 10,000 public presenters globally.",
    },
  ];

  const instructorMap: Record<string, string> = {};

  for (const inst of instructorsData) {
    let profile = await prisma.profile.findFirst({
      where: { OR: [{ email: inst.email }, { userId: inst.userId }] },
    });
    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: inst.name,
          role: inst.role,
          imageUrl: inst.imageUrl,
          bio: inst.bio,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: inst.userId,
          email: inst.email,
          name: inst.name,
          role: inst.role,
          imageUrl: inst.imageUrl,
          bio: inst.bio,
        },
      });
    }
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
      bio: "Lifelong learner exploring business and design.",
    },
    {
      userId: "student_marcus_vance",
      email: "marcus.vance@student.izba.app",
      name: "Marcus Vance",
      role: Role.student,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Curious student studying data science and personal growth.",
    },
  ];

  const studentMap: Record<string, string> = {};

  for (const stud of studentsData) {
    let profile = await prisma.profile.findFirst({
      where: { OR: [{ email: stud.email }, { userId: stud.userId }] },
    });
    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: stud.name,
          role: stud.role,
          imageUrl: stud.imageUrl,
          bio: stud.bio,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: stud.userId,
          email: stud.email,
          name: stud.name,
          role: stud.role,
          imageUrl: stud.imageUrl,
          bio: stud.bio,
        },
      });
    }
    studentMap[stud.email] = profile.id;
    console.log(`✓ Student: ${profile.name}`);
  }

  // 4. Seed 6 Educational Learning Courses
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const coursesData = [
    {
      title: "Mastering Business Leadership & Strategic Management",
      slug: "mastering-business-leadership-management",
      description: "Develop executive decision-making, team leadership strategies, operations management, organizational psychology, and strategic growth planning for modern leaders.",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "INTERMEDIATE",
      categorySlug: "business-leadership",
      instructorEmail: "david.kim@izba.app",
      chapters: [
        {
          title: "Principles of Modern Leadership & Vision Setting",
          description: "Understand foundational leadership styles, emotional intelligence, and inspiring team alignment.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "High-Performance Team Management & Delegation",
          description: "Learn effective delegation frameworks, active listening, and constructive feedback loops.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Strategic Decision Making & Organizational Growth",
          description: "Analyze market opportunities, manage change resistance, and build resilient organizations.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Creative Visual Arts & Graphic Design Mastery",
      slug: "creative-visual-arts-graphic-design",
      description: "Master visual composition, color theory, creative typography, digital illustration, brand identity systems, and design thinking for aspiring visual artists.",
      thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "design-creative-arts",
      instructorEmail: "alex.rivera@izba.app",
      chapters: [
        {
          title: "Foundations of Visual Harmony & Color Theory",
          description: "Master color palettes, contrast, negative space, and visual weight in composition.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Creative Typography, Layout & Hierarchy",
          description: "Learn font pairing, editorial layouts, grid systems, and expressive lettering.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Digital Illustration & Brand Identity Systems",
          description: "Build cohesive visual identities, brand guidelines, and evocative digital art.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Foundations of Data Science & Critical Thinking",
      slug: "foundations-of-data-science-critical-thinking",
      description: "Learn quantitative reasoning, exploratory data analysis, statistical logic, data visualization, and evidence-based problem solving for modern learners.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "science-technology",
      instructorEmail: "sarah.chen@izba.app",
      chapters: [
        {
          title: "Introduction to Data-Driven Thinking & Statistical Logic",
          description: "Understand variables, distributions, averages, and avoiding common cognitive biases in data.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Exploratory Analysis & Pattern Discovery",
          description: "Explore datasets to uncover correlations, trends, anomalies, and underlying drivers.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Data Visualization & Communicating Scientific Insights",
          description: "Translate complex numbers into clear, narrative-driven charts and presentations.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Mastering Public Speaking & Confident Communication",
      slug: "mastering-public-speaking-communication",
      description: "Overcome stage anxiety, master articulate verbal delivery, persuasive storytelling techniques, and compelling presentation skills for any audience.",
      thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "communication-languages",
      instructorEmail: "elena.rostova@izba.app",
      chapters: [
        {
          title: "The Psychology of Confident Public Speaking",
          description: "Deconstruct speech anxiety, reprogram stage fright, and build authentic executive presence.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Crafting Compelling Speeches & Narrative Structure",
          description: "Master the 3-act speech structure, emotional hooks, and persuasive arguments.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Vocal Control, Body Language & Audience Engagement",
          description: "Harness eye contact, purposeful gestures, vocal modulation, and audience Q&A mastery.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Financial Literacy, Personal Finance & Smart Investing",
      slug: "financial-literacy-personal-finance-investing",
      description: "Build a strong financial future with practical mastery of budgeting, debt elimination, savings strategies, compound interest, index investing, and wealth building.",
      thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "finance-economics",
      instructorEmail: "david.kim@izba.app",
      chapters: [
        {
          title: "Core Principles of Budgeting & Money Management",
          description: "Establish baseline net worth, cash flow tracking, and automated emergency funds.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Understanding Debt, Savings & Compound Growth",
          description: "Master high-yield savings, debt snowball vs avalanche, and the mathematics of compounding.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Smart Investing in Stocks, Index Funds & Assets",
          description: "Demystify asset allocation, low-cost index funds, risk management, and long-term horizons.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          position: 3,
          isPublished: true,
          isFree: false,
        },
      ],
    },
    {
      title: "Mindfulness, Habit Formation & Personal Growth",
      slug: "mindfulness-productivity-personal-growth",
      description: "Unlock daily focus, sustainable habit formation, emotional balance, stress reduction, and mindful routines designed for lifelong well-being.",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
      price: 0,
      isPublished: true,
      isFeatured: true,
      level: "BEGINNER",
      categorySlug: "personal-development",
      instructorEmail: "sarah.chen@izba.app",
      chapters: [
        {
          title: "The Science of Habit Formation & Deep Focus",
          description: "Learn cue-routine-reward loops, habit stacking, and overcoming procrastination.",
          videoUrl: sampleVideoUrl,
          position: 1,
          isPublished: true,
          isFree: true,
        },
        {
          title: "Stress Reduction, Breathwork & Mindful Living",
          description: "Practical breathing exercises, somatic awareness, and cognitive reframing techniques.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          position: 2,
          isPublished: true,
          isFree: false,
        },
        {
          title: "Designing Your Personal Growth Blueprint",
          description: "Synthesize learning into a personalized daily schedule, goal review, and lifelong vision.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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

  console.log("Seeding finished successfully with genuine educational learning catalog!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
