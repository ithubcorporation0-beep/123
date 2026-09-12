import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { db } from "@/lib/db";

export async function HeroSection() {
  let heroContent: any = null;
  try {
    heroContent = await db.websiteContent.findFirst({
      where: { section: "hero", isPublished: true },
      orderBy: { position: "asc" },
    });
  } catch {}

  let title = "Empower Your Future with World-Class Online Learning.";
  let subtitle = "Access structured learning courses, interactive lessons, and recognized certificates designed by passionate educators to help you master new skills at your own pace.";

  if (heroContent?.title && !heroContent.title.toLowerCase().includes("software engineering")) {
    title = heroContent.title;
  }
  if (heroContent?.content && !heroContent.content.toLowerCase().includes("technical teams")) {
    subtitle = heroContent.content;
  }

  const chipTag = "Online Learning Academy";
  const ctaText = heroContent?.linkText || "Start Learning Now";
  const ctaUrl = heroContent?.linkUrl || "/courses";

  return (
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 border-b border-[#E5E7EB] bg-white">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Vibrant Rounded Announcement Chip with 10px radius */}
        <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-[10px] border border-[#E5E7EB] bg-[#F2F2F2] text-[#061C30] text-xs font-semibold mb-8 hover:bg-[#EAEAEA] transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#0E68B3]" />
          <span className="text-[#5B5B5B] font-normal">{chipTag}</span>
          <span className="h-3 w-px bg-[#E5E7EB]" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-[#0E68B3]">
            Open Enrollment
          </span>
        </div>

        {/* Main Heading — modern 48px 700, tight line-height, -2px tracking */}
        <h1 className="animate-fade-in-up text-[38px] sm:text-[46px] md:text-[52px] text-[#061C30] font-bold tracking-[-2px] max-w-4xl leading-[1.15]">
          {title}
        </h1>

        {/* Subtitle with 1.6 line-height */}
        <p className="animate-fade-in-up delay-100 mt-6 text-base sm:text-lg text-[#5B5B5B] max-w-2xl font-normal leading-[1.6]">
          {subtitle}
        </p>

        {/* CTA Buttons - 10px radius, vibrant hover translateY(-3px) & glow */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[10px] px-6 py-3 h-auto text-sm font-bold bg-[#0E68B3] hover:bg-[#0B538F] text-white shadow-none gap-2 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.5)] cursor-pointer"
            >
              <span>{ctaText || "Explore All Courses"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a href="#courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-[10px] px-6 py-3 h-auto text-sm font-semibold border-[#E5E7EB] bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#061C30] shadow-none gap-2 transition-all duration-250 hover:-translate-y-[2px] cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-[#0E68B3]" />
              <span>View Curriculums</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
