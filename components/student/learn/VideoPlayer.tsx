"use client";

import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { toast } from "sonner";
import { Video } from "lucide-react";

interface VideoPlayerProps {
  playbackId?: string | null;
  videoUrl?: string | null;
  title: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string | null;
  isCompleted: boolean;
}

export function VideoPlayer({
  playbackId,
  videoUrl,
  title,
  courseId,
  chapterId,
  nextChapterId,
  isCompleted,
}: VideoPlayerProps) {
  const router = useRouter();

  const handleEnded = async () => {
    try {
      if (!isCompleted) {
        await fetch(`/api/progress/${chapterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isCompleted: true }),
        });

        toast.success("Chapter completed! 🎉");
      }

      if (nextChapterId) {
        toast.info("Auto-advancing to the next lesson...");
        router.push(`/student/learn/${courseId}/${nextChapterId}`);
      }

      router.refresh();
    } catch (error) {
      console.error("[VIDEO_ENDED_ERROR]", error);
    }
  };

  return (
    <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border shadow-lg flex items-center justify-center">
      {playbackId ? (
        <MuxPlayer
          playbackId={playbackId}
          metadata={{
            video_title: title,
          }}
          onEnded={handleEnded}
          className="w-full h-full"
          autoPlay={false}
        />
      ) : videoUrl ? (
        <video
          src={videoUrl}
          controls
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
          <div className="p-4 rounded-2xl bg-white/5 mb-3">
            <Video className="h-10 w-10 opacity-60 text-white" />
          </div>
          <p className="text-sm font-semibold text-white">No video streaming asset available</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            This lesson contains written lecture notes and materials below.
          </p>
        </div>
      )}
    </div>
  );
}
