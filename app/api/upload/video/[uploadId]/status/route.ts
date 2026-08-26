import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mux } from "@/lib/mux";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uploadId } = await params;
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    const upload = await mux.video.uploads.retrieve(uploadId);

    if (!upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    if (upload.status !== "asset_created" || !upload.asset_id) {
      return NextResponse.json({
        status: upload.status || "waiting",
      });
    }

    const asset = await mux.video.assets.retrieve(upload.asset_id);

    if (asset.status === "ready") {
      const playbackId = asset.playback_ids?.[0]?.id;
      const videoUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;

      if (chapterId) {
        // Delete previous MuxData and Mux asset if exists
        const existingMuxData = await db.muxData.findUnique({
          where: { chapterId },
        });

        if (existingMuxData) {
          try {
            await mux.video.assets.delete(existingMuxData.assetId);
          } catch (e) {
            // Ignore error if asset was already deleted
          }

          await db.muxData.delete({
            where: { id: existingMuxData.id },
          });
        }

        if (playbackId) {
          await db.muxData.create({
            data: {
              chapterId,
              assetId: asset.id,
              playbackId,
            },
          });

          await db.chapter.update({
            where: { id: chapterId },
            data: {
              videoUrl,
            },
          });
        }
      }

      return NextResponse.json({
        status: "ready",
        assetId: asset.id,
        playbackId,
        videoUrl,
      });
    }

    return NextResponse.json({
      status: asset.status || "preparing",
    });
  } catch (error: any) {
    console.error("[VIDEO_STATUS_GET]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
