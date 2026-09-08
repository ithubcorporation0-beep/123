import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, Star, User, PlayCircle, ArrowUpRight } from "lucide-react";

export interface CourseCardProps {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  level?: string | null;
  instructorName?: string | null;
  instructorAvatar?: string | null;
  chaptersCount?: number;
  lessonsCount?: number;
  enrollmentsCount?: number;
  price?: number;
  isFree?: boolean;
}

export function CourseCard({
  id,
  title,
  slug,
  description,
  thumbnail,
  category = "Development",
  level = "Beginner",
  instructorName = "IZBA Instructor",
  instructorAvatar,
  chaptersCount = 0,
  lessonsCount = 0,
  enrollmentsCount = 0,
  price = 0,
  isFree = true,
}: CourseCardProps) {
  const targetId = slug || id;
  const courseLink = `/courses/${targetId}`;

  const levelColorMap: Record<string, string> = {
    Beginner: "border-emerald-500/30 text-emerald-600 bg-emerald-500/10",
    Intermediate: "border-blue-500/30 text-blue-600 bg-blue-500/10",
    Advanced: "border-purple-500/30 text-purple-600 bg-purple-500/10",
  };

  const levelClass = levelColorMap[level || "Beginner"] || "border-muted text-muted-foreground bg-muted";

  return (
    <Card className="group rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-foreground/20 hover:shadow-md hover-card-lift">
      <div>
        {/* Card Thumbnail */}
        <Link href={courseLink} className="relative aspect-video w-full block overflow-hidden bg-muted border-b border-border/60">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center p-6">
              <div className="p-3 rounded-xl bg-background text-foreground shadow-xs">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Floating Badges Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-background/95 text-foreground border border-border/70 shadow-xs backdrop-blur-md">
              {price === 0 || isFree ? "Free" : `$${price.toFixed(2)}`}
            </span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {category && (
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-foreground text-background font-mono shadow-xs">
                {category}
              </span>
            )}
            {level && (
              <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-md bg-background/90 text-muted-foreground border border-border/60 backdrop-blur-md font-mono">
                {level}
              </span>
            )}
          </div>
        </Link>

        {/* Card Title & Info */}
        <CardHeader className="p-5 pb-2 space-y-1.5">
          <Link href={courseLink} className="block group-hover:text-primary transition-colors">
            <h3 className="font-bold text-base leading-snug line-clamp-2 text-foreground flex items-start justify-between gap-1">
              <span>{title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0 mt-0.5" />
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="px-5 pb-4">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Instructor Row */}
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
            {instructorAvatar ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-border">
                <Image src={instructorAvatar} alt={instructorName || "Instructor"} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 border border-border">
                <User className="h-3 w-3" />
              </div>
            )}
            <span className="truncate text-[11px]">
              Instructor: <strong className="text-foreground font-medium">{instructorName}</strong>
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Metrics */}
      <CardFooter className="p-4 pt-3 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
          <PlayCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{chaptersCount || lessonsCount || 5} {(chaptersCount === 1 || lessonsCount === 1) ? "Chapter" : "Chapters"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{enrollmentsCount || 120} learners</span>
        </div>
      </CardFooter>
    </Card>
  );
}
