/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/general/navbar/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { navbarUpdateSchema } from "@/schemas/navbar";
import { listNavbarItems, upsertNavbarItems } from "@/services/navbarService";

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

// GET: return { items } for the dashboard editor [file:1]
export async function GET() {
  try {
    const items = await listNavbarItems();

    return NextResponse.json({ items }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching navbar items", error);
    return NextResponse.json(
      { error: "Failed to fetch navbar items" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: accept { items: [...] } or raw [...], validate with Zod, call service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Dashboard sends { items } [file:1], but allow raw array too
    const parsed = navbarUpdateSchema.parse(body);
    const itemsArray = Array.isArray(parsed) ? parsed : parsed.items;

    const result = await upsertNavbarItems(itemsArray);

    return NextResponse.json(
      { items: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid payload", issues: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Error updating navbar items", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update navbar items";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
