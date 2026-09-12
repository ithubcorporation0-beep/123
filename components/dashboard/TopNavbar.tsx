"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, GraduationCap, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export type UserRole = "admin" | "instructor" | "student" | string;

interface TopNavbarProps {
  userRole: UserRole;
  userName: string | null;
  userEmail: string;
}

export function TopNavbar({ userRole, userName, userEmail }: TopNavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isSignedIn } = useUser();
  const isAdmin = userRole === "admin";

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button variant="ghost" size="icon" aria-label="Open sidebar menu" className="rounded-[10px]">
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
          <span className="font-bold text-sm tracking-tight text-foreground">IZBA Learning HUB</span>
        </div>

        {/* Role Badge Indicator */}
        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="outline" className="text-xs uppercase font-bold rounded-[10px] border-primary/20 text-primary bg-primary/5">
            {isAdmin ? (
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> Root Admin
              </span>
            ) : (
              `${userRole} Workspace`
            )}
          </Badge>
        </div>
      </div>

      {/* Right Side User Profile Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-bold text-foreground leading-tight">
            {userName || "Administrator"}
          </span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>

        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="h-8 px-3 rounded-[10px] text-xs font-semibold gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 cursor-pointer"
            title="Sign out of Admin Session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin Exit</span>
          </Button>
        )}

        {isSignedIn ? (
          <UserButton />
        ) : (
          <div className="w-8 h-8 rounded-[10px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shadow-xs">
            {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
        )}
      </div>
    </header>
  );
}
