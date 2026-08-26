"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & User Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2 font-medium">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="font-medium shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center gap-3">
          {isLoaded && isSignedIn && <UserButton />}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4 pt-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-base font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary font-semibold" : "text-foreground/80"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t">
                {isLoaded && (
                  <>
                    {isSignedIn ? (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block">
                        <Button className="w-full gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Go to Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                          <Button variant="outline" className="w-full">
                            Sign in
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)} className="w-full block">
                          <Button className="w-full">
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
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
