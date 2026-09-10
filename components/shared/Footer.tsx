import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Heart, Shield, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] bg-[#F2F2F2]">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-[#545454] leading-[1.6]">
              IZBA Learning HUB is an open, high-quality learning and enterprise technology platform dedicated to empowering students, creators, and scaling businesses worldwide.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h3 className="font-serif text-base text-[#194866] font-normal mb-4">
              Platform Tracks
            </h3>
            <ul className="space-y-2.5 text-sm text-[#545454]">
              <li>
                <Link href="/courses" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform font-semibold text-[#194866]">
                  IT Services & Solutions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  About IZBA HUB
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Pricing & Access
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: IT Services & Solutions */}
          <div>
            <h3 className="font-serif text-base text-[#194866] font-normal mb-4">
              IT Services
            </h3>
            <ul className="space-y-2.5 text-sm text-[#545454]">
              <li>
                <Link href="/services#software-solutions" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Software Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#website-solutions" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Website Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#digital-marketing" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/services#graphic-design" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Graphic Design
                </Link>
              </li>
              <li>
                <Link href="/services#ecommerce-solutions" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  E-Commerce Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Access */}
          <div>
            <h3 className="font-serif text-base text-[#194866] font-normal mb-4">
              Portals & Roles
            </h3>
            <ul className="space-y-2.5 text-sm text-[#545454]">
              <li>
                <Link href="/student" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Student Learning Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Instructor Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform font-semibold text-[#194866]">
                  Admin Passcode Portal (446655)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#194866] hover:translate-x-1 inline-block transition-transform">
                  Standard User Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Platform Trust */}
          <div className="space-y-3">
            <h3 className="font-serif text-base text-[#194866] font-normal mb-4">
              Verified Learning
            </h3>
            <p className="text-sm text-[#545454] leading-[1.6]">
              Every course on IZBA features real progression tracking, validated quizzes, and certificate verification.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-[#545454]">
              <span>Crafted for lifelong learners</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#DEDEDE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#545454]">
          <p>&copy; {new Date().getFullYear()} IZBA Learning HUB. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[30px] border border-[#DEDEDE] bg-white text-[#194866] font-semibold hover:bg-[#194866] hover:text-white transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Access</span>
            </Link>
            <Link href="/about" className="hover:text-[#194866] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#194866] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#194866] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
