// src/app/api/landing/about/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultAboutData } from "@/static/aboutDefaults";
import { upsertAbout } from "@/services/aboutService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default about row explicitly
export async function POST() {
  try {
    const defaults = getDefaultAboutData();
    const { id: _id, ...payload } = defaults;

    const about = await upsertAbout(payload);

    return NextResponse.json(
      { message: "Landing about seeded successfully", about },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding landing about", error);
    return NextResponse.json(
      { error: "Failed to seed landing about" },
      { status: 500, headers: corsHeaders },
    );
  }
}
