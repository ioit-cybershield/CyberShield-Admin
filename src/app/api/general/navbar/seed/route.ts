// src/app/api/general/navbar/seed/route.ts
import { NextResponse } from "next/server";
import { getDefaultNavbarItems } from "@/static/navbarDefaults";
import { upsertNavbarItems } from "@/services/navbarService";

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
