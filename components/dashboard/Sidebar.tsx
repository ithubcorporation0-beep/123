"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Users,
  BarChart3,
  ShieldAlert,
  FolderTree,
  ExternalLink,
  Presentation,
  Award,
  ChevronDown,
  Shield,
  GraduationCap,
  Image as ImageIcon,
  Globe,
  Compass,
  Activity,
  Layers,
  LogOut,
  FileText,
  User,
  PlusCircle,
} from "lucide-react";

export type UserRole = "admin" | "instructor" | "student" | string;

interface SidebarProps {
  userRole?: UserRole;
  userName?: string | null;
  onNavigate?: () => void;
}

export function Sidebar({ userRole = "student", userName, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = userRole === "admin";
  const isInstructor = userRole === "instructor" || isAdmin;

  // Determine current active panel based on URL
  const isViewingAdmin = pathname.startsWith("/admin");
  const isViewingInstructor = pathname.startsWith("/instructor") || pathname.startsWith("/teacher");
  const isViewingStudent = !isViewingAdmin && !isViewingInstructor;

  const studentLinks = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/my-courses", icon: BookOpen },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  const instructorLinks = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Courses", href: "/teacher/courses", icon: Presentation },
    { label: "Students", href: "/teacher/students", icon: Users },
    { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
    { label: "Settings", href: "/teacher/settings", icon: Settings },
  ];

  // Exact 13 items + Logout requested by the user:
  // 1. Dashboard, 2. Courses, 3. Categories, 4. Modules, 5. Lessons, 6. Students,
  // 7. Teachers, 8. Enrollments, 9. Media Library, 10. Website Content, 11. Certificates,
  // 12. Settings, 13. Admin Profile
  const adminLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Add / Remove Items", href: "/admin/manage", icon: PlusCircle },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Modules", href: "/admin/modules", icon: Layers },
    { label: "Lessons", href: "/admin/lessons", icon: FileText },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Teachers", href: "/admin/teachers", icon: Presentation },
    { label: "Enrollments", href: "/admin/enrollments", icon: Users },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Website Content", href: "/admin/content", icon: Globe },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Admin Profile", href: "/admin/profile", icon: User },
  ];

  // Active panel configuration
  let currentPanelTitle = "Student Portal";
  let activeLinks = studentLinks;

  if (isViewingAdmin && isAdmin) {
    currentPanelTitle = "Admin Panel";
    activeLinks = adminLinks;
  } else if (isViewingInstructor && isInstructor) {
    currentPanelTitle = "Instructor Workspace";
    activeLinks = instructorLinks;
  }

  const navigateTo = (href: string) => {
    if (onNavigate) onNavigate();
    router.push(href);
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  return (
    <aside className="flex flex-col h-full bg-card border-r w-64 p-4 justify-between">
      <div className="space-y-5">
        {/* Top Header & Logo */}
        <div className="px-2 py-1 flex items-center justify-between">
          <Logo />
        </div>

        {/* Panel Switcher / Role Header */}
        {isInstructor ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto py-2.5 px-3 rounded-[10px] bg-muted/40 hover:bg-muted/70 border text-left cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-[10px] bg-primary/10 text-primary shrink-0">
                      {isViewingAdmin ? (
                        <Shield className="h-4 w-4" />
                      ) : isViewingInstructor ? (
                        <Presentation className="h-4 w-4" />
                      ) : (
                        <GraduationCap className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 truncate">
                      <span className="text-xs font-bold text-foreground truncate">
                        {currentPanelTitle}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Switch Workspace
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-56 rounded-[10px] p-2 shadow-lg">
              <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase px-2 py-1">
                Select Portal
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigateTo("/student")}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs font-medium cursor-pointer"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>Student Portal</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigateTo("/teacher")}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs font-medium cursor-pointer"
              >
                <Presentation className="h-4 w-4 text-primary" />
                <span>Instructor Workspace</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => navigateTo("/admin")}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs font-medium cursor-pointer"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="px-3 py-2 rounded-[10px] bg-muted/40 border flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground truncate">
                Student Portal
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0.5 px-2 rounded-[10px]">
              Learner
            </Badge>
          </div>
        )}

        <Separator />

        {/* Dedicated Panel Navigation */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {currentPanelTitle}
          </div>
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/student" &&
                link.href !== "/teacher" &&
                link.href !== "/admin" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-primary-foreground" : "text-primary/80"
                  }`}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
          {isViewingAdmin && (
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-all duration-200 text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0 text-destructive" />
              <span className="truncate">Logout</span>
            </button>
          )}
        </nav>
      </div>

      {/* Footer Utility Link */}
      <div className="pt-4 border-t space-y-1.5">
        {isAdmin && (
          <Link href="/admin" onClick={onNavigate} className="w-full block">
            <Button
              variant={isViewingAdmin ? "default" : "outline"}
              size="sm"
              className="w-full justify-start gap-2 text-xs rounded-[10px] font-bold"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin Panel
            </Button>
          </Link>
        )}
        <Link href="/" target="_blank" className="w-full block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground rounded-[10px]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public Website
          </Button>
        </Link>
      </div>
    </aside>
  );
}
