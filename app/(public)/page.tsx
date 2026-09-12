import { HeroSection } from "@/components/website/HeroSection";
import { FeaturedCourses } from "@/components/website/FeaturedCourses";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedCourses />
    </div>
  );
}
