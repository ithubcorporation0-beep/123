import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Clock, Star, User } from "lucide-react";

export interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  instructorName: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree?: boolean;
}

export function CourseCard({
  title,
  slug,
  description,
  category,
  instructorName,
  lessonsCount,
  duration,
  rating,
  reviewsCount,
  price,
  isFree = false,
}: CourseCardProps) {
  return (
    <Card className="rounded-2xl border bg-card overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/40 group">
      <div>
        {/* Card Header & Thumbnail Graphic */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center p-6 border-b">
          <div className="p-4 rounded-2xl bg-background/90 shadow-sm text-primary transition-transform group-hover:scale-110 duration-200">
            <BookOpen className="h-8 w-8" />
          </div>
          <Badge className="absolute top-3 right-3 font-semibold text-xs" variant={isFree || price === 0 ? "secondary" : "default"}>
            {isFree || price === 0 ? "Free" : `$${price.toFixed(2)}`}
          </Badge>
          <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs" variant="outline">
            {category}
          </Badge>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewsCount} reviews)</span>
          </div>

          <Link href={`/courses/${slug}`} className="group-hover:text-primary transition-colors">
            <h3 className="font-bold text-lg leading-snug line-clamp-2 text-foreground">
              {title}
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="px-5 pb-3">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>Instructor: <strong className="text-foreground font-medium">{instructorName}</strong></span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-3 border-t bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{lessonsCount} lessons</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{duration}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
