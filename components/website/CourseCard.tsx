import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, PlayCircle, ArrowUpRight, User } from "lucide-react";

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

  return (
    <Card className="group rounded-[16px] border border-[#DEDEDE] bg-white shadow-none overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-[#194866]/40 hover:-translate-y-1">
      <div>
        {/* Card Thumbnail */}
        <Link href={courseLink} className="relative aspect-video w-full block overflow-hidden bg-[#F2F2F2] border-b border-[#DEDEDE]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#F2F2F2] flex items-center justify-center p-6">
              <div className="p-3 rounded-[12px] bg-white border border-[#DEDEDE] text-[#194866]">
                <BookOpen className="h-6 w-6 text-[#194866]" />
              </div>
            </div>
          )}

          {/* Floating Badges Overlay (30px radius chips) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span className="text-xs font-bold px-3 py-1 rounded-[30px] bg-[#FF9F59] text-[#194866] border border-[#FF9F59]/30">
              {price === 0 || isFree ? "Free" : `$${price.toFixed(2)}`}
            </span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {category && (
              <span className="text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-[30px] bg-[#194866] text-white">
                {category}
              </span>
            )}
            {level && (
              <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-[30px] bg-white/95 text-[#545454] border border-[#DEDEDE]">
                {level}
              </span>
            )}
          </div>
        </Link>

        {/* Card Title & Info */}
        <CardHeader className="p-5 pb-2 space-y-1.5">
          <Link href={courseLink} className="block group-hover:text-[#194866] transition-colors">
            <h3 className="font-serif text-xl leading-[1.2] font-normal text-[#194866] flex items-start justify-between gap-2">
              <span className="line-clamp-2">{title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF9F59] shrink-0 mt-1" />
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="px-5 pb-4">
          {description && (
            <p className="text-sm text-[#545454] line-clamp-2 leading-[1.6]">
              {description}
            </p>
          )}

          {/* Instructor Row */}
          <div className="mt-4 pt-3 border-t border-[#DEDEDE] flex items-center gap-2 text-xs text-[#545454]">
            {instructorAvatar ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#DEDEDE]">
                <Image src={instructorAvatar} alt={instructorName || "Instructor"} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#F2F2F2] text-[#194866] flex items-center justify-center shrink-0 border border-[#DEDEDE]">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="truncate text-xs">
              Instructor: <strong className="text-[#282828] font-semibold">{instructorName}</strong>
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Metrics */}
      <CardFooter className="p-4 pt-3 border-t border-[#DEDEDE] bg-[#F2F2F2] flex items-center justify-between text-xs text-[#545454]">
        <div className="flex items-center gap-1.5 font-medium text-[#282828]">
          <PlayCircle className="h-4 w-4 text-[#194866]" />
          <span>{chaptersCount || lessonsCount || 5} {(chaptersCount === 1 || lessonsCount === 1) ? "Chapter" : "Chapters"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#545454]">
          <Users className="h-4 w-4 text-[#194866]" />
          <span>{enrollmentsCount || 120} learners</span>
        </div>
      </CardFooter>
    </Card>
  );
}
