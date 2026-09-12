"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, ArrowRight, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const defaultNavLinks = [
  { label: "Courses", href: "/courses" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(defaultNavLinks);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    fetch("/api/admin/navigation?location=header")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((d: any) => d.isActive).map((d: any) => ({ label: d.label, href: d.url }));
          if (active.length > 0) setNavLinks(active);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DEDEDE] bg-white transition-all">
      <div className="max-w-[1585px] mx-auto flex h-16 items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F2F2F2] p-1 rounded-[40px] border border-[#DEDEDE]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-[30px] text-xs font-semibold transition-all ${
                  isActive
                    ? "text-white bg-[#194866]"
                    : "text-[#545454] hover:text-[#194866] hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & User Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin/login">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 gap-1.5 text-xs font-semibold rounded-[40px] border-[#DEDEDE] bg-white hover:bg-[#F2F2F2] text-[#194866]"
            >
              <Shield className="h-3.5 w-3.5 text-[#194866]" />
              <span>Admin</span>
            </Button>
          </Link>

          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-9 px-4 gap-2 text-xs font-semibold rounded-[40px] bg-[#194866] text-white hover:bg-[#194866]/90"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-xs font-semibold text-[#545454] hover:text-[#194866] rounded-[40px]"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-5 text-xs font-semibold rounded-[40px] bg-[#FF9F59] hover:bg-[#FF9F59]/90 text-[#194866] gap-1.5 shadow-none"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center gap-3">
          {isLoaded && isSignedIn && <UserButton />}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="rounded-full">
                  <Menu className="h-5 w-5 text-[#194866]" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between border-l border-[#DEDEDE] bg-white">
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-2 pt-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-sm font-semibold px-4 py-3 rounded-[12px] transition-all ${
                          isActive
                            ? "text-white bg-[#194866]"
                            : "text-[#545454] hover:text-[#194866] hover:bg-[#F2F2F2]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#DEDEDE]">
                <Link href="/admin/login" onClick={() => setIsOpen(false)} className="w-full block">
                  <Button variant="outline" className="w-full rounded-[40px] font-semibold border-[#DEDEDE] text-[#194866]">
                    <Shield className="h-4 w-4 mr-2 text-[#194866]" />
                    Admin Passcode Access
                  </Button>
                </Link>

                {isLoaded && isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block">
                    <Button className="w-full gap-2 rounded-[40px] font-semibold bg-[#194866] text-white">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button variant="outline" className="w-full rounded-[40px] font-semibold border-[#DEDEDE] text-[#194866]">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button className="w-full rounded-[40px] font-semibold bg-[#FF9F59] text-[#194866]">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
