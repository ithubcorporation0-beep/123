import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Video, GraduationCap, CheckCircle2 } from "lucide-react";
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
  const bgImage = heroContent?.imageUrl || "/images/hero-student-online-class.jpg";

  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-32 border-b border-[#E5E7EB]">
      {/* Background Student Online Class Photography Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={bgImage}
          alt="Student taking online class"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Multi-layer gradient overlays ensuring high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/88 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/92 via-white/78 to-white/96" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Vibrant Rounded Announcement Chip with 10px radius */}
        <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[10px] border border-[#E5E7EB] bg-white/90 backdrop-blur-md text-[#061C30] text-xs font-semibold mb-8 shadow-xs hover:bg-white transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#0E68B3] animate-pulse" />
          <span className="text-[#5B5B5B] font-medium">{chipTag}</span>
          <span className="h-3 w-px bg-[#E5E7EB]" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-[#0E68B3]">
            Open Enrollment
          </span>
        </div>

        {/* Main Heading — modern 48px 700, tight line-height, -2px tracking */}
        <h1 className="animate-fade-in-up text-[38px] sm:text-[48px] md:text-[56px] text-[#061C30] font-bold tracking-[-2px] max-w-4xl leading-[1.12]">
          {title}
        </h1>

        {/* Subtitle with 1.6 line-height */}
        <p className="animate-fade-in-up delay-100 mt-6 text-base sm:text-lg text-[#5B5B5B] max-w-2xl font-normal leading-[1.6]">
          {subtitle}
        </p>

        {/* CTA Buttons - 10px radius, vibrant hover translateY(-3px) & glow */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href={ctaUrl} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[10px] px-7 py-3.5 h-auto text-sm font-bold bg-[#0E68B3] hover:bg-[#0B538F] text-white shadow-sm gap-2 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_8px_2px_rgba(14,104,179,0.4)] cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a href="#courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-[10px] px-6 py-3.5 h-auto text-sm font-semibold border-[#E5E7EB] bg-white/90 backdrop-blur-md hover:bg-white text-[#061C30] shadow-xs gap-2 transition-all duration-250 hover:-translate-y-[2px] cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-[#0E68B3]" />
              <span>View Curriculums</span>
            </Button>
          </a>
        </div>

        {/* Trust Badges - Highlights that this is genuine online learning */}
        <div className="animate-fade-in-up delay-300 mt-12 pt-8 border-t border-[#E5E7EB]/60 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 max-w-2xl text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#0E68B3]/10 text-[#0E68B3] flex items-center justify-center shrink-0">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#061C30]">Interactive Video Lessons</p>
              <p className="text-[11px] text-[#5B5B5B]">On-demand HD streaming</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#0E68B3]/10 text-[#0E68B3] flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#061C30]">Verified Certificates</p>
              <p className="text-[11px] text-[#5B5B5B]">Shareable credentials</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#061C30]">Self-Paced Learning</p>
              <p className="text-[11px] text-[#5B5B5B]">Lifetime course access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
