import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
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

  if (!course) {
    notFound();
  }

  // Check enrollment status if user is signed in
  isEnrolled = user
    ? Boolean(
        await db.enrollment.findUnique({
          where: {
            profileId_courseId: {
              profileId: user.id,
              courseId: course.id,
            },
          },
        })
      )
    : false;
  } catch (error) {
    console.warn("[COURSE_DETAIL_PAGE] Error fetching course:", error);
    notFound();
  }

  const totalChapters = course.chapters.length;
  const enrollmentsCount = course.enrollments.length;
  const firstChapterId = course.chapters[0]?.id || null;

  // Find first incomplete chapter for "Continue learning"
  const firstIncompleteChapter = course.chapters.find((ch: any) => {
    const isCompleted = (ch as any).userProgress?.[0]?.isCompleted;
    return !isCompleted;
  }) || course.chapters[0];

  const nextChapterId = firstIncompleteChapter?.id || firstChapterId;

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {course.category && (
                <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
                  {course.category.name}
                </Badge>
              )}
              {course.level && (
                <Badge variant="outline" className="px-3 py-1 text-xs font-semibold uppercase">
                  {course.level}
                </Badge>
              )}
              <Badge variant="default" className="px-3 py-1 text-xs font-semibold">
                {course.price === 0 ? "100% Free" : `$${course.price}`}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {course.title}
            </h1>

            {course.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Teacher Row */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                {course.instructor?.imageUrl ? (
                  <Image
                    src={course.instructor.imageUrl}
                    alt={course.instructor.name || "Instructor"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created by</p>
                <p className="text-sm font-bold text-foreground">
                  {course.instructor?.name || "EduFlow Instructor"}
                </p>
              </div>
            </div>

            {/* Key Course Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t max-w-md">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5 text-primary" />
                  Curriculum
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Students
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {enrollmentsCount} Enrolled
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <BarChart className="h-3.5 w-3.5 text-primary" />
                  Skill Level
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {course.level || "Beginner"}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Action Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Card className="rounded-3xl border shadow-lg overflow-hidden bg-card">
              {/* Card Image */}
              <div className="relative aspect-video w-full bg-muted/40 border-b">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-muted">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                      Lifetime Access
                    </span>
                  </div>
                </div>

                {/* Interactive Enrollment Button */}
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  firstChapterId={firstChapterId}
                  nextChapterId={nextChapterId}
                  isSignedIn={Boolean(user)}
                />

                {/* Features List */}
                <div className="space-y-3 pt-2 text-xs text-muted-foreground border-t">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Full lifetime access to all lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Self-paced interactive learning</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Certificate of completion upon finishing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Curriculum & Chapters */}
        <div className="max-w-3xl space-y-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Course Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {totalChapters} lessons covering fundamental and advanced concepts.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.chapters.length > 0 ? (
              course.chapters.map((chapter: any, index: number) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 rounded-2xl border bg-card/60 transition-all hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-muted text-xs font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {chapter.title}
                      </p>
                      {chapter.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {chapter.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {chapter.isFree ? (
                      <Link href={`/student/learn/${course.id}/${chapter.id}`}>
                        <Badge variant="secondary" className="gap-1 text-[11px] font-semibold text-primary cursor-pointer hover:bg-primary/20">
                          <PlayCircle className="h-3 w-3" />
                          Free preview
                        </Badge>
                      </Link>
                    ) : isEnrolled ? (
                      <Link href={`/student/learn/${course.id}/${chapter.id}`}>
                        <Badge variant="outline" className="gap-1 text-[11px] font-semibold text-foreground cursor-pointer hover:bg-muted">
                          <PlayCircle className="h-3 w-3 text-primary" />
                          Start
                        </Badge>
                      </Link>
                    ) : (
                      <div className="p-2 rounded-xl text-muted-foreground/60">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No published chapters available yet.
              </p>
            )}
          </div>
        </div>

        {/* Instructor Card Section */}
        <div className="max-w-3xl pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            About the Instructor
          </h2>
          <Card className="rounded-2xl border bg-card/50 p-6">
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border bg-muted shrink-0 flex items-center justify-center">
                {course.instructor?.imageUrl ? (
                  <Image
                    src={course.instructor.imageUrl}
                    alt={course.instructor.name || "Instructor"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-7 w-7 text-primary" />
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">
                  {course.instructor?.name || "EduFlow Instructor"}
                </h3>
                <p className="text-xs text-primary font-semibold">
                  Course Author & Specialist
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
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
