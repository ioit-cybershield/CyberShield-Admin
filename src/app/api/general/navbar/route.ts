// src/app/api/navbar/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:4321", // Or specify your domain: "https://example.com"
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const items = await prisma.navbar.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ items }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching navbar items:", error);
    return NextResponse.json(
      { error: "Failed to fetch navbar items" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request: items must be an array" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.key || !item.label) {
        return NextResponse.json(
          { error: "Each item must have a key and label" },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    // Use transaction to update all items
    const operations = items.map((item) =>
      prisma.navbar.upsert({
        where: { key: item.key },
        create: {
          key: item.key,
          label: item.label,
          href: item.href || null,
          order: item.order || 0,
          isActive: item.isActive ?? true,
        },
        update: {
          label: item.label,
          href: item.href || null,
          order: item.order || 0,
          isActive: item.isActive ?? true,
        },
      }),
    );

    const result = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error updating navbar items:", error);
    return NextResponse.json(
      { error: "Failed to update navbar items" },
      { status: 500, headers: corsHeaders },
    );
  }
}
