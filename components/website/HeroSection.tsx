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

  const title = heroContent?.title || "Master modern software engineering and cloud infrastructure.";
  const subtitle = heroContent?.content || heroContent?.subtitle || "Structured technical curriculums, production-ready modules, and cryptographically verified certifications designed for ambitious developers and technical teams.";
  const chipTag = heroContent?.subtitle ? "Featured Announcement" : "Next-Gen LMS Platform";
  const ctaText = heroContent?.linkText || "Explore All Curriculums";
  const ctaUrl = heroContent?.linkUrl || "/courses";

  return (
    <section className="relative overflow-hidden pt-14 pb-14 md:pt-20 md:pb-20 border-b border-[#DEDEDE] bg-white">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Vibrant Rounded Announcement Chip */}
        <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[30px] border border-[#DEDEDE] bg-[#F2F2F2] text-[#282828] text-xs font-semibold mb-8 hover:bg-[#EAEAEA] transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#FF9F59]" />
          <span className="text-[#545454] font-normal">{chipTag}</span>
          <span className="h-3 w-px bg-[#DEDEDE]" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-[#194866]">
            Enterprise Edition
          </span>
        </div>

        {/* Main Heading in DM Serif Display */}
        <h1 className="animate-fade-in-up font-serif text-[42px] sm:text-[50px] md:text-[56px] text-[#194866] font-normal tracking-tight max-w-4xl leading-[1.05]">
          {title}
        </h1>

        {/* Subtitle with Generous Line-Height (1.6) in Open Sans */}
        <p className="animate-fade-in-up delay-100 mt-6 text-base sm:text-lg text-[#545454] max-w-2xl font-normal leading-[1.6]">
          {subtitle}
        </p>

        {/* CTA Buttons - 40px radius, 12px 25px padding */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[40px] px-[25px] py-[12px] h-auto text-sm font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2"
            >
              <span>{ctaText || "Explore All Courses"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a href="#courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-[40px] px-[25px] py-[12px] h-auto text-sm font-semibold border-[#DEDEDE] bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#194866] shadow-none gap-2"
            >
              <BookOpen className="h-4 w-4 text-[#194866]" />
              <span>View Curriculums</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
