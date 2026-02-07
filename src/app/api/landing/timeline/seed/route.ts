// src/app/api/landing/timeline/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultTimelineStates } from "@/static/timelineDefaults";
import { upsertTimelineStates } from "@/services/timelineServices";

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

// POST: seed default timeline states explicitly
export async function POST() {
  try {
    const defaults = getDefaultTimelineStates();

    const states = await upsertTimelineStates(defaults);

    return NextResponse.json(
      { message: "Landing timeline seeded successfully", states },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding landing timeline", error);
    return NextResponse.json(
      { error: "Failed to seed landing timeline" },
      { status: 500, headers: corsHeaders },
    );
  }
}
