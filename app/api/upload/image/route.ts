import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Instructor or Admin role required" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files are allowed." },
        { status: 400 }
      );
    }

    // Validate size (max 4MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 4MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if Cloudinary credentials are fully configured
    const hasCloudinary = Boolean(
      (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (hasCloudinary) {
      try {
        // Upload to Cloudinary stream
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "eduflow/courses",
              resource_type: "image",
            },
            (error, res) => {
              if (error) {
                reject(error);
              } else {
                resolve(res);
              }
            }
          );
          uploadStream.end(buffer);
        });

        return NextResponse.json({
          url: result.secure_url || result.url,
          publicId: result.public_id,
        });
      } catch (cloudinaryError) {
        console.warn("[UPLOAD_CLOUDINARY_FAILED, FALLING_BACK_TO_LOCAL]", cloudinaryError);
      }
    }

    // Local filesystem fallback: write to public/uploads
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const cleanFileName = `course-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${cleanFileName}`,
      publicId: cleanFileName,
    });
  } catch (error: any) {
    console.error("[UPLOAD_IMAGE_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error during upload" },
      { status: 500 }
    );
  }
}
