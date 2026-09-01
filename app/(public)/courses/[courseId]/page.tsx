import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { findFallbackCourse, FALLBACK_COURSES } from "@/lib/course-catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollButton } from "@/components/website/EnrollButton";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  Users,
  BarChart,
  User,
  Star,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  Share2,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params;
  let user: any = null;
  let course: any = null;
  let isEnrolled = false;

  try {
    user = await getCurrentUser();
    course = await db.course.findFirst({
      where: {
        OR: [{ id: courseId }, { slug: courseId }],
        isPublished: true,
      },
      include: {
        category: true,
        instructor: true,
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
          include: {
            userProgress: user
              ? {
                  where: {
                    profileId: user.id,
                  },
                }
              : false,
          },
        },
        enrollments: true,
      },
    });

    if (course && user) {
      isEnrolled = Boolean(
        await db.enrollment.findUnique({
          where: {
            profileId_courseId: {
              profileId: user.id,
              courseId: course.id,
            },
          },
        })
      );
    }
  } catch (error) {
    console.warn("[COURSE_DETAIL_PAGE] DB query error (using fallback):", error);
  }

  // Fallback to rich catalog if DB record is not yet seeded
  if (!course) {
    const fallback = findFallbackCourse(courseId);
    course = {
      id: fallback.id,
      title: fallback.title,
      slug: fallback.slug,
      description: fallback.description,
      thumbnail: fallback.thumbnail,
      price: fallback.price,
      level: fallback.level,
      category: fallback.category,
      instructor: fallback.instructor,
      learningOutcomes: fallback.learningOutcomes,
      prerequisites: fallback.prerequisites,
      chapters: fallback.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        description: ch.description,
        position: ch.position,
        isFree: ch.isFree,
        duration: ch.duration,
        videoUrl: ch.videoUrl,
        userProgress: [],
      })),
      enrollments: Array(fallback.enrollmentsCount).fill({}),
      rating: fallback.rating,
      reviewsCount: fallback.reviewsCount,
    };
  }

  const totalChapters = course.chapters?.length || 0;
  const enrollmentsCount = course.enrollments?.length || 120;
  const firstChapterId = course.chapters?.[0]?.id || "ch_1";
  const learningOutcomes =
    course.learningOutcomes || [
      "Architect and scale full-stack web applications with modern industry tooling.",
      "Understand core design systems, responsive layouts, and accessibility standards.",
      "Write clean, maintainable, and type-safe code following best practices.",
      "Earn a verified completion certificate with a tamper-proof credential ID.",
    ];
  const prerequisites = course.prerequisites || [
    "Basic knowledge of web development concepts.",
    "A computer with internet access and a code editor.",
  ];

  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/courses" className="hover:text-foreground transition-colors">
            Courses
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </nav>

        {/* Hero Header Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Course Info (Left Col) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {course.category && (
                <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                  {course.category.name}
                </Badge>
              )}
              {course.level && (
                <Badge variant="outline" className="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {course.level}
                </Badge>
              )}
              <Badge variant="default" className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white hover:bg-emerald-600">
                {course.price === 0 ? "100% Free Access" : `$${course.price}`}
              </Badge>
              <div className="flex items-center text-amber-500 gap-1 text-xs font-semibold ml-2">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="text-foreground font-bold">4.9</span>
                <span className="text-muted-foreground">({course.reviewsCount || 128} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.18]">
              {course.title}
            </h1>

            {course.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Author & Metrics Ribbon */}
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-border/60 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/30 bg-muted shrink-0">
                  {course.instructor?.imageUrl ? (
                    <Image
                      src={course.instructor.imageUrl}
                      alt={course.instructor.name || "Instructor"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary m-auto mt-2" />
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">Lead Instructor</p>
                  <p className="font-bold text-foreground">
                    {course.instructor?.name || "IZBA Instructor"}
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-border hidden sm:block" />

              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5 text-primary" /> Lessons
                </p>
                <p className="font-bold text-foreground">{totalChapters} Structured Chapters</p>
              </div>

              <div className="h-8 w-px bg-border hidden sm:block" />

              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" /> Students
                </p>
                <p className="font-bold text-foreground">{enrollmentsCount.toLocaleString()} Enrolled</p>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment & Action Sidebar (Right Col) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Card className="rounded-3xl border border-border/80 shadow-2xl overflow-hidden bg-card/90 backdrop-blur-xl">
              {/* Card Preview Media */}
              <div className="relative aspect-video w-full bg-muted/60 border-b border-border/60 overflow-hidden group">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-7 w-7 fill-current" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold ml-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Lifetime Access
                    </span>
                  </div>
                </div>

                {/* Enrollment Interactive CTA */}
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  firstChapterId={firstChapterId}
                  nextChapterId={firstChapterId}
                  isSignedIn={Boolean(user)}
                />

                {/* Key Benefits */}
                <div className="space-y-3 pt-4 text-xs text-muted-foreground border-t border-border/60">
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Full access to all video lessons & notes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Self-paced interactive learning with code files</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <Award className="h-4 w-4 text-primary shrink-0" />
                    <span>Official verified completion certificate</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>Direct Q&A access with instructor</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What You'll Learn Section */}
        <div className="max-w-3xl rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> What you will learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {learningOutcomes.map((outcome: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Curriculum Section */}
        <div className="max-w-3xl space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Course Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {totalChapters} comprehensive lessons structured for step-by-step mastery.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter: any, index: number) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/70 hover:bg-card hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-extrabold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      {chapter.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {chapter.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {chapter.duration && (
                      <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {chapter.duration}
                      </span>
                    )}

                    {chapter.isFree ? (
                      <Link href={`/student/learn/${course.id}/${chapter.id}`}>
                        <Badge variant="secondary" className="gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer py-1 px-3 rounded-full">
                          <PlayCircle className="h-3.5 w-3.5" />
                          Free Preview
                        </Badge>
                      </Link>
                    ) : isEnrolled ? (
                      <Link href={`/student/learn/${course.id}/${chapter.id}`}>
                        <Badge variant="outline" className="gap-1.5 text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer py-1 px-3 rounded-full">
                          <PlayCircle className="h-3.5 w-3.5 text-primary" />
                          Start Lesson
                        </Badge>
                      </Link>
                    ) : (
                      <div className="p-2 rounded-xl text-muted-foreground/60 bg-muted/40">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Curriculum modules loading...</p>
            )}
          </div>
        </div>

        {/* Prerequisites Section */}
        <div className="max-w-3xl pt-6 border-t border-border/60 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Requirements & Prerequisites</h2>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground">
            {prerequisites.map((req: string, i: number) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Instructor Bio Card */}
        <div className="max-w-3xl pt-8 border-t border-border/60">
          <h2 className="text-2xl font-extrabold text-foreground mb-5">
            About Your Instructor
          </h2>
          <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted shrink-0 shadow-md">
                {course.instructor?.imageUrl ? (
                  <Image
                    src={course.instructor.imageUrl}
                    alt={course.instructor.name || "Instructor"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary m-auto mt-4" />
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {course.instructor?.name || "IZBA Instructor"}
                  </h3>
                  <p className="text-xs text-primary font-semibold">
                    Principal Course Author & Technical Specialist
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {course.instructor?.bio ||
                    "Passionate educator committed to providing high-quality, practical learning experiences for aspiring students and developers worldwide."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
