/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/landing/gallery/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { galleryUpdateSchema } from "@/schemas/gallery";
import {
  listGalleryItems,
  upsertGalleryItems,
} from "@/services/galleryService";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? (process.env.PUBLICSITEORIGIN ?? "https://ioit-cybershield.github.io")
      : "http://localhost:4321",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: fetch gallery items, support ?landingOnly=true (same behavior as before) [file:1]
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const landingOnly = url.searchParams.get("landingOnly") === "true";

    const items = await listGalleryItems({ landingOnly });

    // Your dashboard expects { items: [...] } [file:1]
    return NextResponse.json({ items }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing gallery", error);
    return NextResponse.json(
      { error: "Failed to fetch landing gallery" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: validate payload with Zod and delegate to service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both shapes: { items: [...] } (current dashboard) and raw array [file:1]
    const parsed = galleryUpdateSchema.parse(body);
    const itemsArray = Array.isArray(parsed) ? parsed : parsed.items;

    const result = await upsertGalleryItems(itemsArray);

    return NextResponse.json(
      { items: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing gallery", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing gallery";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
