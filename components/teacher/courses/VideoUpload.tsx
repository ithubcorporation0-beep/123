"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Video, UploadCloud, Loader2, RefreshCw, X, PlayCircle } from "lucide-react";

interface VideoUploadProps {
  initialData: {
    videoUrl: string | null;
    muxData?: {
      playbackId: string | null;
    } | null;
  };
  courseId: string;
  chapterId: string;
}

export function VideoUpload({
  initialData,
  courseId,
  chapterId,
}: VideoUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleVideoSelect = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, WebM, MOV, etc.)");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Step 1: Request Direct Upload URL from our backend
      const res = await fetch("/api/upload/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to initialize video upload");
      }

      const { uploadId, uploadUrl } = await res.json();

      // Step 2: Directly upload file to Mux with XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Direct upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during video upload"));
        xhr.send(file);
      });

      setIsUploading(false);
      setIsProcessing(true);
      toast.info("Upload complete! Processing video with Mux...");

      // Step 3: Poll status route until video is ready
      let isReady = false;
      while (!isReady) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const statusRes = await fetch(`/api/upload/video/${uploadId}/status?chapterId=${chapterId}`);

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === "ready") {
            isReady = true;
            break;
          } else if (statusData.status === "errored") {
            throw new Error("Mux video processing encountered an error");
          }
        }
      }

      toast.success("Video processed and ready for streaming!");
      setIsProcessing(false);
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error("[VIDEO_UPLOAD_ERROR]", error);
      toast.error(error.message || "Failed to upload video");
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoSelect(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelect(e.target.files[0]);
    }
  };

  const playbackId = initialData.muxData?.playbackId;

  return (
    <Card className="rounded-2xl border bg-card/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between font-semibold text-sm mb-3">
          <span>Chapter Video</span>
          <Button
            onClick={() => setIsEditing((prev) => !prev)}
            variant="ghost"
            size="sm"
            disabled={isUploading || isProcessing}
            className="rounded-xl text-xs gap-1.5 h-8 px-2.5 text-muted-foreground hover:text-foreground"
          >
            {isEditing ? (
              <>
                <X className="h-3.5 w-3.5" />
                Cancel
              </>
            ) : playbackId ? (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Replace video
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                Upload video
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          !playbackId ? (
            <div className="flex flex-col items-center justify-center h-52 bg-muted/40 rounded-xl border border-dashed text-center p-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-2">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">No video uploaded</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                Upload video lectures for adaptive HLS streaming powered by Mux.
              </p>
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm bg-black">
              <MuxPlayer
                playbackId={playbackId}
                metadata={{
                  video_title: "Chapter Lecture",
                }}
                className="w-full h-full"
              />
            </div>
          )
        )}

        {isEditing && (
          <div>
            {!isUploading && !isProcessing ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center h-52 rounded-xl border-2 border-dashed transition-colors cursor-pointer text-center p-6 ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-primary/50 bg-muted/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={onFileChange}
                />

                <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Video className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  Select a video file or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MP4, MOV, WebM, MKV format supported
                </p>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center h-52 rounded-xl border bg-muted/20 p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <UploadCloud className="h-7 w-7 animate-bounce" />
                </div>
                <div className="w-full max-w-xs space-y-2 text-center">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>Uploading directly to Mux...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Please do not close this browser tab
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 rounded-xl border bg-muted/20 p-6 space-y-3 text-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Processing video stream...
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Mux is encoding your video for multi-bitrate adaptive streaming. This may take 10-30 seconds.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
