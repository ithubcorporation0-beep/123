import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_DOC_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mediaTypeParam = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    let detectedType = "document";

    if (mimeType.startsWith("image/")) {
      detectedType = "image";
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: "Image file exceeds 15MB limit" }, { status: 400 });
      }
    } else if (mimeType.startsWith("video/")) {
      detectedType = "video";
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: "Video file exceeds 100MB limit" }, { status: 400 });
      }
    } else if (mimeType === "application/pdf") {
      detectedType = "pdf";
      if (file.size > MAX_DOC_SIZE) {
        return NextResponse.json({ error: "PDF file exceeds 30MB limit" }, { status: 400 });
      }
    } else {
      detectedType = "document";
      if (file.size > MAX_DOC_SIZE) {
        return NextResponse.json({ error: "Document file exceeds 30MB limit" }, { status: 400 });
      }
    }

    const finalType = mediaTypeParam || detectedType;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl = "";
    let publicId: string | null = null;

    // Check Cloudinary
    const hasCloudinary = Boolean(
      (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (hasCloudinary) {
      try {
        const resourceType = finalType === "video" ? "video" : finalType === "image" ? "image" : "raw";
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `lms-cms/${finalType}s`,
              resource_type: resourceType,
            },
            (error, res) => {
              if (error) reject(error);
              else resolve(res);
            }
          );
          uploadStream.end(buffer);
        });

        fileUrl = result.secure_url || result.url;
        publicId = result.public_id || null;
      } catch (cloudErr) {
        console.warn("[CLOUDINARY_UPLOAD_WARN, USING_LOCAL]", cloudErr);
      }
    }

    // Fallback to local public/uploads directory
    if (!fileUrl) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadsDir = path.join(process.cwd(), "public", "uploads", `${finalType}s`);

      await fs.mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(file.name) || (finalType === "video" ? ".mp4" : finalType === "pdf" ? ".pdf" : ".jpg");
      const cleanFileName = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, cleanFileName);

      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${finalType}s/${cleanFileName}`;
    }

    // Persist to MediaItem table
    const mediaRecord = await db.mediaItem.create({
      data: {
        name: file.name,
        url: fileUrl,
        publicId: publicId,
        type: finalType,
        size: file.size,
        mimeType: mimeType,
      },
    });

    // Log Activity
    await logActivity({
      adminEmail: user.email,
      action: "UPLOAD",
      targetType: "media",
      targetId: mediaRecord.id,
      details: `Uploaded ${finalType}: ${file.name} (${Math.round(file.size / 1024)} KB)`,
    });

    return NextResponse.json(mediaRecord, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_MEDIA_UPLOAD_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
