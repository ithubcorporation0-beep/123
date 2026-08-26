"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR_BOUNDARY]", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center shadow-inner">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-destructive tracking-widest uppercase">
            Unexpected Error
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground bg-muted/40 p-2 rounded-xl border">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-2xl font-bold gap-2 text-xs"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-2xl font-semibold gap-2 text-xs">
              <Home className="h-4 w-4" />
              Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
