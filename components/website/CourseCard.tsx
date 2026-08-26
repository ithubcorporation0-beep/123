import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, Star, User, PlayCircle } from "lucide-react";

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
  instructorName = "EduFlow Instructor",
  instructorAvatar,
  chaptersCount = 0,
  lessonsCount = 0,
  enrollmentsCount = 0,
  price = 0,
  isFree = true,
}: CourseCardProps) {
  const courseLink = `/courses/${id}`;

  return (
    <Card className="rounded-2xl border bg-card overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/40 group">
      <div>
        {/* Card Thumbnail */}
        <Link href={courseLink} className="relative aspect-video w-full block overflow-hidden bg-muted/40 border-b">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center p-6">
              <div className="p-4 rounded-2xl bg-background/90 shadow-sm text-primary transition-transform group-hover:scale-110 duration-200">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Badge className="font-bold text-xs shadow-sm" variant="secondary">
              {price === 0 || isFree ? "Free" : `$${price.toFixed(2)}`}
            </Badge>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {category && (
              <Badge className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold" variant="outline">
                {category}
              </Badge>
            )}
            {level && (
              <Badge className="bg-background/90 backdrop-blur-sm text-foreground text-[10px] uppercase font-bold" variant="outline">
                {level}
              </Badge>
            )}
          </div>
        </Link>

        {/* Card Title & Info */}
        <CardHeader className="p-5 pb-2">
          <Link href={courseLink} className="group-hover:text-primary transition-colors">
            <h3 className="font-bold text-lg leading-snug line-clamp-2 text-foreground">
              {title}
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="px-5 pb-3">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Instructor Row */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            {instructorAvatar ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                <Image src={instructorAvatar} alt={instructorName || "Instructor"} fill className="object-cover" />
              </div>
            ) : (
              <User className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
            <span className="truncate">
              Instructor: <strong className="text-foreground font-medium">{instructorName}</strong>
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Metrics */}
      <CardFooter className="p-5 pt-3 border-t bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <PlayCircle className="h-3.5 w-3.5 text-primary" />
          <span>{chaptersCount || lessonsCount || 0} {chaptersCount === 1 || lessonsCount === 1 ? "chapter" : "chapters"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>{enrollmentsCount} {enrollmentsCount === 1 ? "student" : "students"}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
