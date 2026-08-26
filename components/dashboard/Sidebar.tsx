"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  Users,
  BarChart3,
  ShieldAlert,
  FolderTree,
  ExternalLink,
  Presentation,
  Award,
} from "lucide-react";
import { Role } from "@prisma/client";

interface SidebarProps {
  userRole?: Role;
  userName?: string | null;
  onNavigate?: () => void;
}

export function Sidebar({ userRole = Role.student, userName, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const isTeacherOrAdmin = userRole === Role.instructor || userRole === Role.admin;
  const isAdmin = userRole === Role.admin;

  const studentLinks = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/my-courses", icon: BookOpen },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  const teacherLinks = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Courses", href: "/teacher/courses", icon: Presentation },
    { label: "Students", href: "/teacher/students", icon: Users },
    { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
    { label: "Settings", href: "/teacher/settings", icon: Settings },
  ];

  const adminLinks = [
    { label: "Overview", href: "/admin", icon: ShieldAlert },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
  ];

  const renderNavSection = (title: string, links: typeof studentLinks) => (
    <div className="space-y-1">
      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
        {title}
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href || (link.href !== "/student" && link.href !== "/teacher" && link.href !== "/admin" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary/70"}`} />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="flex flex-col h-full bg-card border-r w-64 p-4 justify-between">
      <div className="space-y-6">
        {/* Top Header & Logo */}
        <div className="px-2 py-1 flex items-center justify-between">
          <Logo />
        </div>

        {/* User Role Pill */}
        <div className="px-2 py-2 rounded-xl bg-muted/50 border flex items-center justify-between">
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-foreground truncate">
              {userName || "Authenticated User"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Active Session
            </span>
          </div>
          <Badge variant={isAdmin ? "default" : isTeacherOrAdmin ? "secondary" : "outline"} className="text-[10px] uppercase font-bold py-0.5 px-2">
            {userRole}
          </Badge>
        </div>

        <Separator />

        {/* Navigation Sections */}
        <nav className="space-y-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {/* Student Portal (Always visible) */}
          {renderNavSection("Student Portal", studentLinks)}

          {/* Teacher Section (Visible to Instructor & Admin) */}
          {isTeacherOrAdmin && renderNavSection("Teacher Workspace", teacherLinks)}

          {/* Admin Section (Visible to Admin only) */}
          {isAdmin && renderNavSection("Admin Management", adminLinks)}
        </nav>
      </div>

      {/* Footer Utility Link */}
      <div className="pt-4 border-t space-y-2">
        <Link href="/" target="_blank" className="w-full block">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            Public Website
          </Button>
        </Link>
      </div>
    </aside>
  );
}
