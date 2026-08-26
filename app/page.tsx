import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { BookOpen, GraduationCap, ShieldCheck, Sparkles, Video, Award } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  const categories = await db.courseCategory.findMany({
    take: 6,
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">EduFlow LMS</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/courses" className="hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!userId ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/student">
                  <Button variant="outline" size="sm">
                    My Learning
                  </Button>
                </Link>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
          <Badge variant="secondary" className="mb-4 gap-1 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Production-Ready LMS Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Master In-Demand Skills with Interactive Courses
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Real courses, real progress tracking, integrated video lessons, automated quizzes, and verified certificates.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="h-12 px-8 text-base">
                Explore Courses
              </Button>
            </Link>
            {!userId && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Create Account
                </Button>
              </Link>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Video className="h-5 w-5" />
                </div>
                <CardTitle>Streamlined Learning</CardTitle>
                <CardDescription>
                  High-speed video streaming, interactive module navigation, and progress tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle>Role-Based Workspaces</CardTitle>
                <CardDescription>
                  Strict separation of Admin, Instructor, and Student workspaces with server-side authorization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Award className="h-5 w-5" />
                </div>
                <CardTitle>Real Certificates</CardTitle>
                <CardDescription>
                  Automated completion validation and verified certificate generation upon 100% course mastery.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Categories Section */}
          <div className="mt-20 w-full max-w-5xl text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors flex items-center gap-3"
                >
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EduFlow LMS Platform. Built with Next.js, Clerk, and PostgreSQL.</p>
      </footer>
    </div>
  );
}
