// src/app/api/landing/hero/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultHeroData } from "@/static/heroDefaults";
import { upsertHero } from "@/services/heroService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default hero row explicitly
export async function POST() {
  try {
    const defaults = getDefaultHeroData();
    const { id: _id, ...payload } = defaults;

    const hero = await upsertHero(payload);

    return NextResponse.json(
      { message: "Landing hero seeded successfully", hero },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding landing hero", error);
    return NextResponse.json(
      { error: "Failed to seed landing hero" },
      { status: 500, headers: corsHeaders },
    );
  }
}
