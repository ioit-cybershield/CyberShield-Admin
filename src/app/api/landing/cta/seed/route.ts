// src/app/api/landing/cta/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultCtaData } from "@/static/ctaDefaults";
import { upsertCta } from "@/services/ctaService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default CTA row explicitly
export async function POST() {
  try {
    const defaults = getDefaultCtaData();
    const { id: _id, ...payload } = defaults;

    const cta = await upsertCta(payload);

    return NextResponse.json(
      { message: "Landing CTA seeded successfully", cta },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding landing CTA", error);
    return NextResponse.json(
      { error: "Failed to seed landing CTA" },
      { status: 500, headers: corsHeaders },
    );
  }
}
