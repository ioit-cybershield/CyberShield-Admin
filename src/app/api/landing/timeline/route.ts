import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:4321", // + your prod URL later
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const states = await prisma.landingTimeline.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(
      { states },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error fetching landing timeline", error);
    return NextResponse.json(
      { error: "Failed to fetch landing timeline" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { states } = body;

    if (!Array.isArray(states)) {
      return NextResponse.json(
        { error: "Invalid request: states must be an array" },
        { status: 400, headers: corsHeaders },
      );
    }

    for (const state of states) {
      if (!state.key || !state.label || !state.titleLines || !state.desc) {
        return NextResponse.json(
          { error: "Each state must have key, label, titleLines, and desc" },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    const operations = states.map((state) =>
      prisma.landingTimeline.upsert({
        where: { key: state.key },
        create: {
          key: state.key,
          label: state.label,
          titleLines: state.titleLines,
          desc: state.desc,
          order: state.order ?? 0,
        },
        update: {
          label: state.label,
          titleLines: state.titleLines,
          desc: state.desc,
          order: state.order ?? 0,
        },
      }),
    );

    const result = await prisma.$transaction(operations);

    return NextResponse.json(
      { states: result },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error updating landing timeline", error);
    return NextResponse.json(
      { error: "Failed to update landing timeline" },
      { status: 500, headers: corsHeaders },
    );
  }
}
