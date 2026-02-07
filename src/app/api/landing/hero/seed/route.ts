// src/app/api/landing/hero/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultHeroData } from "@/static/heroDefaults";
import { upsertHero } from "@/services/heroService";

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
