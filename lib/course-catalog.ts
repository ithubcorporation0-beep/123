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
    id: "course_business_leadership",
    title: "Mastering Business Leadership & Strategic Management",
    slug: "mastering-business-leadership-management",
    description:
      "Develop executive decision-making, team leadership strategies, operations management, organizational psychology, and strategic growth planning for modern leaders.",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_business",
      name: "Business & Leadership",
      slug: "business-leadership",
    },
    level: "Intermediate",
    price: 0,
    instructor: {
      id: "inst_david",
      name: "David Kim",
      email: "david.kim@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Executive Coach & Management Educator with 15+ years guiding entrepreneurs and organizational leaders.",
    },
    learningOutcomes: [
      "Develop visionary leadership frameworks and clear team goal alignment.",
      "Master effective delegation, conflict resolution, and talent motivation.",
      "Execute data-informed strategic decision making and risk assessments.",
      "Scale organizational culture and foster cross-functional collaboration.",
    ],
    prerequisites: ["Curiosity for organizational leadership and management principles."],
    chapters: [
      {
        id: "ch_bl_1",
        title: "1. Principles of Modern Leadership & Vision Setting",
        description: "Understand foundational leadership styles, emotional intelligence, and inspiring team alignment.",
        position: 1,
        isFree: true,
        duration: "22 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "ch_bl_2",
        title: "2. High-Performance Team Management & Delegation",
        description: "Learn effective delegation frameworks, active listening, and constructive feedback loops.",
        position: 2,
        isFree: false,
        duration: "30 min",
      },
      {
        id: "ch_bl_3",
        title: "3. Strategic Decision Making & Organizational Growth",
        description: "Analyze market opportunities, manage change resistance, and build resilient organizations.",
        position: 3,
        isFree: false,
        duration: "28 min",
      },
    ],
    enrollmentsCount: 2450,
    rating: 4.9,
    reviewsCount: 384,
    isFeatured: true,
  },
  {
    id: "course_creative_design",
    title: "Creative Visual Arts & Graphic Design Mastery",
    slug: "creative-visual-arts-graphic-design",
    description:
      "Master visual composition, color theory, creative typography, digital illustration, brand identity systems, and design thinking for aspiring visual artists.",
    thumbnail:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_design",
      name: "Design & Creative Arts",
      slug: "design-creative-arts",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_alex",
      name: "Alex Rivera",
      email: "alex.rivera@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Creative Director & Visual Design Educator passionate about unlocking creative potential in learners.",
    },
    learningOutcomes: [
      "Apply core principles of balance, contrast, hierarchy, and harmony.",
      "Harness color psychology to create emotionally resonant visual designs.",
      "Craft bespoke typography layouts, posters, and digital publications.",
      "Transform creative concepts into impactful brand identity systems.",
    ],
    prerequisites: ["No prior drawing or design experience required."],
    chapters: [
      {
        id: "ch_cd_1",
        title: "1. Foundations of Visual Harmony & Color Theory",
        description: "Master color palettes, contrast, negative space, and visual weight in composition.",
        position: 1,
        isFree: true,
        duration: "20 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "ch_cd_2",
        title: "2. Creative Typography, Layout & Hierarchy",
        description: "Learn font pairing, editorial layouts, grid systems, and expressive lettering.",
        position: 2,
        isFree: false,
        duration: "28 min",
      },
      {
        id: "ch_cd_3",
        title: "3. Digital Illustration & Brand Identity Systems",
        description: "Build cohesive visual identities, brand guidelines, and evocative digital art.",
        position: 3,
        isFree: false,
        duration: "32 min",
      },
    ],
    enrollmentsCount: 1980,
    rating: 4.8,
    reviewsCount: 310,
    isFeatured: true,
  },
  {
    id: "course_data_science",
    title: "Foundations of Data Science & Critical Thinking",
    slug: "foundations-of-data-science-critical-thinking",
    description:
      "Learn quantitative reasoning, exploratory data analysis, statistical logic, data visualization, and evidence-based problem solving for modern learners.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_science",
      name: "Science & Technology",
      slug: "science-technology",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_sarah",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Associate Professor of Computational Science dedicated to making data literacy accessible to everyone.",
    },
    learningOutcomes: [
      "Interpret charts, datasets, and statistical summaries with critical clarity.",
      "Formulate testable hypotheses and evaluate empirical evidence.",
      "Create clear, compelling data visualizations that reveal meaningful patterns.",
      "Apply scientific problem-solving methods to complex challenges.",
    ],
    prerequisites: ["Basic curiosity and arithmetic understanding."],
    chapters: [
      {
        id: "ch_ds_1",
        title: "1. Introduction to Data-Driven Thinking & Statistical Logic",
        description: "Understand variables, distributions, averages, and avoiding common cognitive biases in data.",
        position: 1,
        isFree: true,
        duration: "24 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "ch_ds_2",
        title: "2. Exploratory Analysis & Pattern Discovery",
        description: "Explore datasets to uncover correlations, trends, anomalies, and underlying drivers.",
        position: 2,
        isFree: false,
        duration: "30 min",
      },
      {
        id: "ch_ds_3",
        title: "3. Data Visualization & Communicating Scientific Insights",
        description: "Translate complex numbers into clear, narrative-driven charts and presentations.",
        position: 3,
        isFree: false,
        duration: "26 min",
      },
    ],
    enrollmentsCount: 1820,
    rating: 4.9,
    reviewsCount: 295,
    isFeatured: true,
  },
  {
    id: "course_public_speaking",
    title: "Mastering Public Speaking & Confident Communication",
    slug: "mastering-public-speaking-communication",
    description:
      "Overcome stage anxiety, master articulate verbal delivery, persuasive storytelling techniques, and compelling presentation skills for any audience.",
    thumbnail:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_communication",
      name: "Communication & Languages",
      slug: "communication-languages",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_elena",
      name: "Elena Rostova",
      email: "elena.rostova@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      bio: "Keynote Speaker & Communication Coach who has mentored over 10,000 public presenters globally.",
    },
    learningOutcomes: [
      "Conquer public speaking nervousness using proven breath and focus techniques.",
      "Structure persuasive speeches with clear hooks, narratives, and calls to action.",
      "Command body language, vocal pacing, and tonal variation for maximum impact.",
      "Engage diverse audiences with authentic, memorable storytelling.",
    ],
    prerequisites: ["Open mind and desire to improve self-expression."],
    chapters: [
      {
        id: "ch_ps_1",
        title: "1. The Psychology of Confident Public Speaking",
        description: "Deconstruct speech anxiety, reprogram stage fright, and build authentic executive presence.",
        position: 1,
        isFree: true,
        duration: "18 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      },
      {
        id: "ch_ps_2",
        title: "2. Crafting Compelling Speeches & Narrative Structure",
        description: "Master the 3-act speech structure, emotional hooks, and persuasive arguments.",
        position: 2,
        isFree: false,
        duration: "25 min",
      },
      {
        id: "ch_ps_3",
        title: "3. Vocal Control, Body Language & Audience Engagement",
        description: "Harness eye contact, purposeful gestures, vocal modulation, and audience Q&A mastery.",
        position: 3,
        isFree: false,
        duration: "27 min",
      },
    ],
    enrollmentsCount: 1640,
    rating: 4.9,
    reviewsCount: 278,
    isFeatured: true,
  },
  {
    id: "course_personal_finance",
    title: "Financial Literacy, Personal Finance & Smart Investing",
    slug: "financial-literacy-personal-finance-investing",
    description:
      "Build a strong financial future with practical mastery of budgeting, debt elimination, savings strategies, compound interest, index investing, and wealth building.",
    thumbnail:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_finance",
      name: "Finance & Economics",
      slug: "finance-economics",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_marcus",
      name: "Marcus Sterling",
      email: "marcus.sterling@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Financial Educator & Economics Specialist helping individuals build lifelong financial independence.",
    },
    learningOutcomes: [
      "Create realistic budgets and automated savings systems that work.",
      "Understand credit, debt payoff strategies, and credit score optimization.",
      "Learn how compound interest transforms modest regular savings over time.",
      "Gain confidence navigating index funds, stocks, and retirement accounts.",
    ],
    prerequisites: ["No financial background needed."],
    chapters: [
      {
        id: "ch_pf_1",
        title: "1. Core Principles of Budgeting & Money Management",
        description: "Establish baseline net worth, cash flow tracking, and automated emergency funds.",
        position: 1,
        isFree: true,
        duration: "19 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      },
      {
        id: "ch_pf_2",
        title: "2. Understanding Debt, Savings & Compound Growth",
        description: "Master high-yield savings, debt snowball vs avalanche, and the mathematics of compounding.",
        position: 2,
        isFree: false,
        duration: "26 min",
      },
      {
        id: "ch_pf_3",
        title: "3. Smart Investing in Stocks, Index Funds & Assets",
        description: "Demystify asset allocation, low-cost index funds, risk management, and long-term horizons.",
        position: 3,
        isFree: false,
        duration: "31 min",
      },
    ],
    enrollmentsCount: 2110,
    rating: 4.9,
    reviewsCount: 340,
    isFeatured: true,
  },
  {
    id: "course_mindfulness_productivity",
    title: "Mindfulness, Habit Formation & Personal Growth",
    slug: "mindfulness-productivity-personal-growth",
    description:
      "Unlock daily focus, sustainable habit formation, emotional balance, stress reduction, and mindful routines designed for lifelong well-being.",
    thumbnail:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80",
    category: {
      id: "cat_personal",
      name: "Personal Development",
      slug: "personal-development",
    },
    level: "Beginner",
    price: 0,
    instructor: {
      id: "inst_maya",
      name: "Maya Patel",
      email: "maya.patel@izba.app",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Mindfulness Coach & Behavioral Psychology Educator committed to helping learners cultivate balance and resilience.",
    },
    learningOutcomes: [
      "Understand the neurological habit loop to build healthy positive routines.",
      "Practice evidence-based mindfulness and breathwork to reduce stress.",
      "Eliminate digital distractions and enter deep-focus flow states.",
      "Design an actionable personal growth blueprint for continuous improvement.",
    ],
    prerequisites: ["Willingness to practice daily mindfulness and reflection."],
    chapters: [
      {
        id: "ch_mp_1",
        title: "1. The Science of Habit Formation & Deep Focus",
        description: "Learn cue-routine-reward loops, habit stacking, and overcoming procrastination.",
        position: 1,
        isFree: true,
        duration: "16 min",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "ch_mp_2",
        title: "2. Stress Reduction, Breathwork & Mindful Living",
        description: "Practical breathing exercises, somatic awareness, and cognitive reframing techniques.",
        position: 2,
        isFree: false,
        duration: "22 min",
      },
      {
        id: "ch_mp_3",
        title: "3. Designing Your Personal Growth Blueprint",
        description: "Synthesize learning into a personalized daily schedule, goal review, and lifelong vision.",
        position: 3,
        isFree: false,
        duration: "25 min",
      },
    ],
    enrollmentsCount: 1750,
    rating: 4.9,
    reviewsCount: 265,
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
