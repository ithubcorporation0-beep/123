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
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white transition-all">
      <div className="max-w-[1585px] mx-auto flex h-16 items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F2F2F2] p-1 rounded-[10px] border border-[#E5E7EB]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${
                  isActive
                    ? "text-white bg-[#0E68B3]"
                    : "text-[#5B5B5B] hover:text-[#0E68B3] hover:bg-white/70"
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
              className="h-9 px-3.5 gap-1.5 text-xs font-semibold rounded-[10px] border-[#E5E7EB] bg-white hover:bg-[#F2F2F2] text-[#061C30] hover:text-[#0E68B3] transition-all duration-200"
            >
              <Shield className="h-3.5 w-3.5 text-[#0E68B3]" />
              <span>Admin</span>
            </Button>
          </Link>

          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-9 px-4 gap-2 text-xs font-semibold rounded-[10px] bg-[#0E68B3] text-white hover:bg-[#0B538F] transition-all duration-250 hover:-translate-y-[2px]"
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
                  className="h-9 px-4 text-xs font-semibold text-[#5B5B5B] hover:text-[#061C30] rounded-[10px]"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-5 text-xs font-bold rounded-[10px] bg-[#0E68B3] hover:bg-[#0B538F] text-white gap-1.5 shadow-none transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.5)]"
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
                <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="rounded-[10px]">
                  <Menu className="h-5 w-5 text-[#0E68B3]" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between border-l border-[#E5E7EB] bg-white">
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
                        className={`text-sm font-semibold px-4 py-3 rounded-[10px] transition-all ${
                          isActive
                            ? "text-white bg-[#0E68B3]"
                            : "text-[#5B5B5B] hover:text-[#061C30] hover:bg-[#F2F2F2]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E7EB]">
                <Link href="/admin/login" onClick={() => setIsOpen(false)} className="w-full block">
                  <Button variant="outline" className="w-full rounded-[10px] font-semibold border-[#E5E7EB] text-[#061C30]">
                    <Shield className="h-4 w-4 mr-2 text-[#0E68B3]" />
                    Admin Passcode Access
                  </Button>
                </Link>

                {isLoaded && isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block">
                    <Button className="w-full gap-2 rounded-[10px] font-semibold bg-[#0E68B3] text-white">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button variant="outline" className="w-full rounded-[10px] font-semibold border-[#E5E7EB] text-[#061C30]">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button className="w-full rounded-[10px] font-semibold bg-[#0E68B3] text-white">
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
