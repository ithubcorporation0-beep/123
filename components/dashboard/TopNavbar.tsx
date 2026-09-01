"use client";

import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, GraduationCap } from "lucide-react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TopNavbarProps {
  userRole: Role;
  userName: string | null;
  userEmail: string;
}

export function TopNavbar({ userRole, userName, userEmail }: TopNavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button variant="ghost" size="icon" aria-label="Open sidebar menu">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              userRole={userRole}
              userName={userName}
              onNavigate={() => setIsMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Workspace Title for Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm tracking-tight">IZBA Learning HUB</span>
        </div>

        {/* Role Badge Indicator */}
        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="outline" className="text-xs uppercase font-semibold">
            {userRole} Workspace
          </Badge>
        </div>
      </div>

      {/* Right Side User Profile Controls */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-foreground leading-tight">
            {userName || "User Profile"}
          </span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>

        <UserButton />
      </div>
    </header>
  );
}
