"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface ChaptersPlaceholderFormProps {
  initialData: {
    modules: any[];
  };
}

export function ChaptersPlaceholderForm({ initialData }: ChaptersPlaceholderFormProps) {
  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Course Chapters & Modules</span>
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-normal">
            Curriculum Builder
          </span>
        </div>

        {initialData.modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-muted/40 rounded-xl border border-dashed text-center p-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
              <Layers className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-foreground">No chapters or modules created</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              Drag-and-drop module reordering and lesson builder will be configured here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {initialData.modules.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-3 rounded-xl border bg-card flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-foreground">
                  {idx + 1}. {m.title}
                </span>
                <span className="text-muted-foreground">
                  {m.lessons?.length || 0} lessons
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
