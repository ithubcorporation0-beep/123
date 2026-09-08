"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "All Courses", href: "/courses" },
  { label: "IT Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Contact & Support", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "text-foreground font-semibold bg-background shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & User Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="h-9 px-3.5 gap-2 text-xs font-medium rounded-xl border-border/70 hover:bg-muted/60 transition-all">
                  <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-medium text-muted-foreground hover:text-foreground rounded-xl">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9 px-4 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all gap-1.5">
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
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between border-l border-border/50">
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
                        className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "text-primary bg-primary/10 font-bold"
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/80">
                {isLoaded && isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block">
                    <Button className="w-full gap-2 rounded-full font-bold">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button variant="outline" className="w-full rounded-full font-semibold">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button className="w-full rounded-full font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-white">
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
