"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImagePlaceholderFormProps {
  initialData: {
    thumbnail: string | null;
  };
}

export function ImagePlaceholderForm({ initialData }: ImagePlaceholderFormProps) {
  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Course Image</span>
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-normal">
            Upload component
          </span>
        </div>

        {!initialData.thumbnail ? (
          <div className="flex flex-col items-center justify-center h-48 bg-muted/40 rounded-xl border border-dashed text-center p-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-foreground">No image uploaded</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              16:9 aspect ratio recommended. Cloudinary image uploader activates in next step.
            </p>
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden border">
            <Image
              src={initialData.thumbnail}
              alt="Course thumbnail"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
