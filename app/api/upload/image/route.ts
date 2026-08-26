import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

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
  } catch (error: any) {
    console.error("[UPLOAD_IMAGE_POST]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error during upload" },
      { status: 500 }
    );
  }
}
