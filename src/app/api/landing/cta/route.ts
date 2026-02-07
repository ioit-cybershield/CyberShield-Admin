/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/landing/cta/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { landingCtaUpdateSchema } from "@/schemas/cta";
import { getCta, upsertCta } from "@/services/ctaService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["GET", "PUT", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: fetch CTA from DB only (no auto-seed)
export async function GET() {
  try {
    const cta = await getCta();

    if (!cta) {
      return NextResponse.json(
        { error: "CTA not seeded yet" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Keep original shape: return the CTA object directly [file:1]
    return NextResponse.json(cta, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing CTA", error);
    return NextResponse.json(
      { error: "Failed to fetch landing CTA" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: validate with Zod and delegate to service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Frontend currently sends the raw payload (no wrapper) [file:1]
    const parsed = landingCtaUpdateSchema.parse(body);

    const cta = await upsertCta(parsed);

    // Keep original shape: return CTA object directly
    return NextResponse.json(cta, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing CTA", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing CTA";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
