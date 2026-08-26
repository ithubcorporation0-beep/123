import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
          <Compass className="h-12 w-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">404 Error</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The link might be broken, or the page may have been moved or removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full rounded-2xl font-bold gap-2 text-xs">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/courses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-2xl font-semibold gap-2 text-xs">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
