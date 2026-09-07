import { HeroSection } from "@/components/website/HeroSection";
import { StatsSection } from "@/components/website/StatsSection";
import { FeaturedCourses } from "@/components/website/FeaturedCourses";
import { CategorySection } from "@/components/website/CategorySection";
import { ITServicesSection } from "@/components/website/ITServicesSection";
import { HowItWorks } from "@/components/website/HowItWorks";
import { Testimonials } from "@/components/website/Testimonials";
import { TeacherCTABanner } from "@/components/website/TeacherCTABanner";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsSection />
      <FeaturedCourses />
      <CategorySection />
      <ITServicesSection />
      <HowItWorks />
      <Testimonials />
      <TeacherCTABanner />
    </div>
  );
}
