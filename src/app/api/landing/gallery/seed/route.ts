// src/app/api/landing/gallery/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultGalleryItems } from "@/static/galleryDefaults";
import { upsertGalleryItems } from "@/services/galleryService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default gallery items explicitly
export async function POST() {
  try {
    const defaults = getDefaultGalleryItems();

    const items = await upsertGalleryItems(defaults);

    return NextResponse.json(
      { message: "Landing gallery seeded successfully", items },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding landing gallery", error);
    return NextResponse.json(
      { error: "Failed to seed landing gallery" },
      { status: 500, headers: corsHeaders },
    );
  }
}
