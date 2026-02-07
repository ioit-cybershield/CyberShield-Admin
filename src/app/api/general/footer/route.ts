/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/general/footer/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { footerUpdateSchema } from "@/schemas/footer";
import { getFooter, upsertFooter } from "@/services/footerService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["GET", "PUT", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: fetch footer from DB only (no auto-seed)
export async function GET() {
  try {
    const footer = await getFooter();

    if (!footer) {
      return NextResponse.json(
        { error: "Footer not seeded yet" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json({ footer }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing footer", error);
    return NextResponse.json(
      { error: "Failed to fetch landing footer" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: validate input with Zod and delegate to service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = footerUpdateSchema.parse(body);

    const footer = await upsertFooter(parsed);

    return NextResponse.json({ footer }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating landing footer", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing footer";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
