// src/app/api/landing/timeline/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultTimelineStates } from "@/static/timelineDefaults";
import { upsertTimelineStates } from "@/services/timelineServices";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

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
