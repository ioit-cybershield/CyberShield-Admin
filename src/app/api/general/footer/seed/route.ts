// src/app/api/general/footer/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultFooterData } from "@/static/footerDefaults";
import { upsertFooter } from "@/services/footerService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default footer row explicitly
export async function POST() {
  try {
    const defaults = getDefaultFooterData();
    const { id: _id, ...payload } = defaults;

    const footer = await upsertFooter(payload);

    return NextResponse.json(
      { message: "Footer seeded successfully", footer },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding footer", error);
    return NextResponse.json(
      { error: "Failed to seed footer" },
      { status: 500, headers: corsHeaders },
    );
  }
}
