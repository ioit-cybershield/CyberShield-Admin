// src/app/api/landing/gallery/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MAX_SLOTS = 3;

// If you want, later drive this from an env var:
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? (process.env.PUBLIC_SITE_ORIGIN ?? "https://ioit-cybershield.github.io")
      : "http://localhost:4321",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const landingOnly = url.searchParams.get("landingOnly") === "true";

    const where = landingOnly ? { slot: { not: null }, isVisible: true } : {};

    const items = await prisma.landingGalleryItem.findMany({
      where,
      orderBy: [{ slot: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ items }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing gallery" },
      { status: 500, headers: corsHeaders },
    );
  }
}

type GalleryInput = {
  id?: string;
  title: string;
  subtitle?: string | null;
  description: string;
  tags?: string[];
  buttonLabel?: string | null;
  buttonHref?: string | null;
  imageBlobPath: string;
  imageAlt: string;
  imageUrl: string;
  slot?: number | null;
  isVisible?: boolean;
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = (body.items ?? body) as GalleryInput[];

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request: items must be an array" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Basic validation and slot constraints
    const usedSlots = new Set<number>();

    for (const item of items) {
      if (
        !item.title ||
        !item.description ||
        !item.imageBlobPath ||
        !item.imageAlt
      ) {
        return NextResponse.json(
          {
            error:
              "title, description, imageBlobPath, and imageAlt are required",
          },
          { status: 400, headers: corsHeaders },
        );
      }

      if (item.slot != null) {
        if (item.slot < 1 || item.slot > MAX_SLOTS) {
          return NextResponse.json(
            { error: `slot must be between 1 and ${MAX_SLOTS}` },
            { status: 400, headers: corsHeaders },
          );
        }
        if (usedSlots.has(item.slot)) {
          return NextResponse.json(
            { error: `Duplicate slot ${item.slot} is not allowed` },
            { status: 400, headers: corsHeaders },
          );
        }
        usedSlots.add(item.slot);
      }
    }

    const operations = items.map((item) =>
      prisma.landingGalleryItem.upsert({
        where: { id: item.id ?? "" },
        update: {
          title: item.title,
          subtitle: item.subtitle ?? null,
          description: item.description,
          tags: item.tags ?? [],
          buttonLabel: item.buttonLabel ?? null,
          buttonHref: item.buttonHref ?? null,
          imageUrl: item.imageUrl,
          imageBlobPath: item.imageBlobPath,
          imageAlt: item.imageAlt,
          slot: item.slot ?? null,
          isVisible: item.isVisible ?? true,
        },
        create: {
          title: item.title,
          subtitle: item.subtitle ?? null,
          description: item.description,
          tags: item.tags ?? [],
          buttonLabel: item.buttonLabel ?? null,
          buttonHref: item.buttonHref ?? null,
          imageBlobPath: item.imageBlobPath,
          imageAlt: item.imageAlt,
          imageUrl: item.imageUrl,
          slot: item.slot ?? null,
          isVisible: item.isVisible ?? true,
        },
      }),
    );

    const result = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error updating landing gallery:", error);
    return NextResponse.json(
      { error: "Failed to update landing gallery" },
      { status: 500, headers: corsHeaders },
    );
  }
}
