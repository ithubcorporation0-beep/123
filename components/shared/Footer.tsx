import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Heart, Shield, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F2F2F2]">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-[#5B5B5B] leading-[1.6]">
              IZBA Learning HUB is an open, high-quality learning platform dedicated to empowering students, creators, and professionals worldwide with structured knowledge.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-[#061C30] uppercase tracking-wider mb-4">
              Course Disciplines
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5B5B5B]">
              <li>
                <Link href="/courses" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform font-bold text-[#0E68B3]">
                  All Courses Catalog
                </Link>
              </li>
              <li>
                <Link href="/courses?category=business-leadership" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Business & Leadership
                </Link>
              </li>
              <li>
                <Link href="/courses?category=design-creative-arts" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Design & Creative Arts
                </Link>
              </li>
              <li>
                <Link href="/courses?category=science-technology" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/courses?category=communication-languages" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Communication & Languages
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Course Tracks & Disciplines */}
          <div>
            <h3 className="text-sm font-bold text-[#061C30] uppercase tracking-wider mb-4">
              Learning Tracks
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5B5B5B]">
              <li>
                <Link href="/courses?category=personal-development" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Personal Development
                </Link>
              </li>
              <li>
                <Link href="/courses?category=finance-economics" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Finance & Economics
                </Link>
              </li>
              <li>
                <Link href="/courses?category=business-leadership" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Strategic Management
                </Link>
              </li>
              <li>
                <Link href="/courses?category=design-creative-arts" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Creative Visual Arts
                </Link>
              </li>
              <li>
                <Link href="/courses?category=communication-languages" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Public Speaking & Rhetoric
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Access */}
          <div>
            <h3 className="text-sm font-bold text-[#061C30] uppercase tracking-wider mb-4">
              Portals & Roles
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5B5B5B]">
              <li>
                <Link href="/student" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Student Learning Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Instructor Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform font-bold text-[#0E68B3]">
                  Admin Passcode Portal (446655)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#0E68B3] hover:translate-x-1 inline-block transition-transform">
                  Standard User Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Platform Trust */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#061C30] uppercase tracking-wider mb-4">
              Verified Learning
            </h3>
            <p className="text-sm text-[#5B5B5B] leading-[1.6]">
              Every course on IZBA features real progression tracking, validated quizzes, and certificate verification.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-[#5B5B5B]">
              <span>Crafted for lifelong learners</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B5B5B]">
          <p>&copy; {new Date().getFullYear()} IZBA Learning HUB. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] border border-[#E5E7EB] bg-white text-[#0E68B3] font-bold hover:bg-[#0E68B3] hover:text-white transition-all duration-200 shadow-xs"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Access</span>
            </Link>
            <Link href="/about" className="hover:text-[#0E68B3] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#0E68B3] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#0E68B3] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
