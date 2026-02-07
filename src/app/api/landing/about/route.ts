/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/landing/about/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { landingAboutUpdateSchema } from "@/schemas/about";
import { getAbout, upsertAbout } from "@/services/aboutService";

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

// GET: fetch about from DB only (no auto-seed)
export async function GET() {
  try {
    const about = await getAbout();

    if (!about) {
      return NextResponse.json(
        { error: "About section not seeded yet" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json({ about }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing about", error);
    return NextResponse.json(
      { error: "Failed to fetch landing about" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: accept { about: {...} } or raw {...}, validate with Zod, call service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Dashboard currently does JSON.stringify({ about }) [file:1]
    const payload = body.about ?? body;

    const parsed = landingAboutUpdateSchema.parse(payload);

    const about = await upsertAbout(parsed);

    return NextResponse.json({ about }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing about", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing about";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
