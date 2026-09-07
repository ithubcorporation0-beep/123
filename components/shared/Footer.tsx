import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              IZBA Learning HUB is an open, high-quality learning and enterprise technology platform dedicated to empowering students, creators, and scaling businesses worldwide.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors font-medium text-foreground/90">
                  IT Services & Solutions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About IZBA HUB
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing & Access
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: IT Services & Solutions */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">
              IT Services
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/services#software-solutions" className="hover:text-primary transition-colors">
                  Software Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#website-solutions" className="hover:text-primary transition-colors">
                  Website Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#digital-marketing" className="hover:text-primary transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/services#graphic-design" className="hover:text-primary transition-colors">
                  Graphic Design
                </Link>
              </li>
              <li>
                <Link href="/services#ecommerce-solutions" className="hover:text-primary transition-colors">
                  E-Commerce Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#inquiry-form" className="hover:text-primary transition-colors text-primary font-semibold">
                  Request a Quote &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Role Panels */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">
              Learning Portals
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/student" className="hover:text-primary transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-primary transition-colors">
                  Instructor Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Community & Mission */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">
              Our Mission
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every course on IZBA features real progression tracking, validated quizzes, and certificate verification.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              <span>for lifelong learners</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IZBA Learning HUB. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
