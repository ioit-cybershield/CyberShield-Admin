// src/app/api/landing/about/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ABOUT_ID = "landing-about-default";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:4321",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const about = await prisma.landingAbout.findUnique({
      where: { id: ABOUT_ID },
    });

    return NextResponse.json({ about }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing about:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing about" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.about ?? body;

    const about = await prisma.landingAbout.upsert({
      where: { id: ABOUT_ID },
      create: { id: ABOUT_ID, ...data },
      update: data,
    });

    return NextResponse.json({ about }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error updating landing about:", error);
    return NextResponse.json(
      { error: "Failed to update landing about" },
      { status: 500, headers: corsHeaders },
    );
  }
}
