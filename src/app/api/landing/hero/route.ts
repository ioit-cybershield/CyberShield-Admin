/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/landing/hero/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { landingHeroUpdateSchema } from "@/schemas/hero";
import { getHero, upsertHero } from "@/services/heroService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["GET", "PUT", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: fetch hero from DB only (no auto-seed)
export async function GET() {
  try {
    const hero = await getHero();

    if (!hero) {
      return NextResponse.json(
        { error: "Hero not seeded yet" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json({ hero }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing hero", error);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: validate with Zod and delegate to service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = landingHeroUpdateSchema.parse(body);

    const hero = await upsertHero(parsed);

    return NextResponse.json({ hero }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing hero", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update hero content";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
