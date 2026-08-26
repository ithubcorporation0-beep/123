"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

interface ChapterVideoPlaceholderProps {
  initialData: {
    videoUrl: string | null;
  };
}

export function ChapterVideoPlaceholder({
  initialData,
}: ChapterVideoPlaceholderProps) {
  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Chapter Video</span>
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-normal">
            Mux Video Stream
          </span>
        </div>

        {!initialData.videoUrl ? (
          <div className="flex flex-col items-center justify-center h-48 bg-muted/40 rounded-xl border border-dashed text-center p-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
              <Video className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-foreground">No video uploaded</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              Mux video player and upload pipeline will be configured in the next step.
            </p>
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-black flex items-center justify-center text-white text-xs">
            Video source linked: {initialData.videoUrl}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
