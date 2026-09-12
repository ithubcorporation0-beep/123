"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, LayoutDashboard, PlusCircle, BookOpen } from "lucide-react";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DASHBOARD_ERROR_CAUGHT]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <div className="bg-card border border-border/80 rounded-[10px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[10px] bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight font-serif">
              Dashboard Component Error
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              An issue occurred while loading this section of the workspace.
            </p>
          </div>
        </div>

        {error?.digest && (
          <div className="p-3 bg-muted/40 rounded-[10px] border border-border text-xs font-mono text-muted-foreground">
            Error Reference: {error.digest}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="rounded-[10px] font-bold text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.5)]"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Action
          </Button>
          <Link href="/admin/manage">
            <Button
              variant="outline"
              className="rounded-[10px] font-semibold text-xs gap-2 border-primary/20 text-primary hover:bg-primary/5"
            >
              <PlusCircle className="h-4 w-4" />
              Add / Remove Items Panel
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button
              variant="outline"
              className="rounded-[10px] font-semibold text-xs gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Course Catalog
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="ghost"
              className="rounded-[10px] font-medium text-xs gap-2 text-muted-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
