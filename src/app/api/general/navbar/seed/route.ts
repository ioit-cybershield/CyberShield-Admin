// src/app/api/general/navbar/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultNavbarItems } from "@/static/navbarDefaults";
import { upsertNavbarItems } from "@/services/navbarService";
import { buildCorsHeaders } from "@/lib/cors";

const corsHeaders = buildCorsHeaders(["POST", "OPTIONS"]);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST: seed default navbar items explicitly
export async function POST() {
  try {
    const defaults = getDefaultNavbarItems();

    const items = await upsertNavbarItems(defaults);

    return NextResponse.json(
      { message: "Navbar seeded successfully", items },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error seeding navbar", error);
    return NextResponse.json(
      { error: "Failed to seed navbar" },
      { status: 500, headers: corsHeaders },
    );
  }
}
