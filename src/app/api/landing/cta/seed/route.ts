// src/app/api/landing/cta/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultCtaData } from "@/static/ctaDefaults";
import { upsertCta } from "@/services/ctaService";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? (process.env.PUBLICSITEORIGIN ?? "https://ioit-cybershield.github.io")
      : "http://localhost:4321",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

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
