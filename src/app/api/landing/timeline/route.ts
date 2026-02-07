/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/landing/timeline/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { timelineUpdateSchema } from "@/schemas/timeline";
import {
  listTimelineStates,
  upsertTimelineStates,
} from "@/services/timelineServices";

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

// GET: fetch timeline states from DB only (no auto-seed)
export async function GET() {
  try {
    const states = await listTimelineStates();

    return NextResponse.json({ states }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing timeline", error);
    return NextResponse.json(
      { error: "Failed to fetch landing timeline" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: accept { states: [...] } or raw [...], validate with Zod, call service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = timelineUpdateSchema.parse(body);
    const statesArray = Array.isArray(parsed) ? parsed : parsed.states;

    const result = await upsertTimelineStates(statesArray);

    return NextResponse.json(
      { states: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing timeline", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing timeline";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
