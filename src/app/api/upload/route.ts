// src/app/api/landing/gallery/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";

    const pathname = `gallery/${crypto.randomUUID()}${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
    }); // returns { pathname, url, downloadUrl, ... }[web:3][web:4][web:19]

    return NextResponse.json(
      {
        pathname: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
