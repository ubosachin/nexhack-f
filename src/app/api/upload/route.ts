import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "nexhack";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form data" },
          { status: 400 }
        );
      }

      // Convert file to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // If Cloudinary is configured, upload directly to Cloudinary
      if (isCloudinaryConfigured()) {
        const result = await uploadImageToCloudinary(buffer, { folder });
        return NextResponse.json({
          success: true,
          storage: "cloudinary",
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }

      // Fallback: Store locally in public/uploads if Cloudinary credentials are not in .env yet
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const fileExt = file.name ? path.extname(file.name) || ".png" : ".png";
      const cleanFileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      const filePath = path.join(uploadsDir, cleanFileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        storage: "local",
        url: `/uploads/${cleanFileName}`,
        message: "Stored in public/uploads. Add Cloudinary credentials to .env to upload directly to Cloudinary CDN.",
      });
    }

    // 2. JSON Body (base64 data URI or remote URL)
    const body = await req.json();
    const { image, folder = "nexhack" } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided in JSON body" },
        { status: 400 }
      );
    }

    if (isCloudinaryConfigured()) {
      const result = await uploadImageToCloudinary(image, { folder });
      return NextResponse.json({
        success: true,
        storage: "cloudinary",
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    // If remote URL is passed directly
    if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
      return NextResponse.json({
        success: true,
        storage: "remote",
        url: image,
      });
    }

    // If base64
    if (typeof image === "string" && image.startsWith("data:image/")) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split("/")[1] || "png";
        const imageBuffer = Buffer.from(matches[2], "base64");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const cleanFileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = path.join(uploadsDir, cleanFileName);
        await writeFile(filePath, imageBuffer);

        return NextResponse.json({
          success: true,
          storage: "local",
          url: `/uploads/${cleanFileName}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      storage: "direct",
      url: image,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
