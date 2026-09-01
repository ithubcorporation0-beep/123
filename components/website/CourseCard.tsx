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
    <Card className="group rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1">
      <div>
        {/* Card Thumbnail */}
        <Link href={courseLink} className="relative aspect-video w-full block overflow-hidden bg-muted/40 border-b border-border/60">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center p-6">
              <div className="p-4 rounded-2xl bg-background/90 shadow-sm text-primary transition-transform group-hover:scale-110 duration-200">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          )}

          {/* Floating Badges Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
            <Badge className="font-bold text-xs shadow-md bg-background/95 backdrop-blur-md text-foreground border border-border/60" variant="outline">
              {price === 0 || isFree ? "100% Free" : `$${price.toFixed(2)}`}
            </Badge>
          </div>

          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
            {category && (
              <Badge className="bg-primary/95 text-primary-foreground font-semibold text-[11px] shadow-sm backdrop-blur-md">
                {category}
              </Badge>
            )}
            {level && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${levelClass}`}>
                {level}
              </span>
            )}
          </div>
        </Link>

        {/* Card Title & Info */}
        <CardHeader className="p-6 pb-2 space-y-2">
          <Link href={courseLink} className="block group-hover:text-primary transition-colors">
            <h3 className="font-extrabold text-lg leading-snug line-clamp-2 text-foreground flex items-start justify-between gap-1">
              <span>{title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary shrink-0 mt-1" />
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Instructor Row */}
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2.5 text-xs text-muted-foreground">
            {instructorAvatar ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border">
                <Image src={instructorAvatar} alt={instructorName || "Instructor"} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="truncate">
              By <strong className="text-foreground font-semibold">{instructorName}</strong>
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Metrics */}
      <CardFooter className="p-6 pt-3.5 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <PlayCircle className="h-4 w-4 text-primary" />
          <span>{chaptersCount || lessonsCount || 5} {(chaptersCount === 1 || lessonsCount === 1) ? "Chapter" : "Chapters"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{enrollmentsCount || 120} learners</span>
        </div>
      </CardFooter>
    </Card>
  );
}
