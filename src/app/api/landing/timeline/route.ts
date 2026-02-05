import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LandingTimeline } from "@/generated/prisma/client";

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

    return NextResponse.json({ states }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing timeline", error);
    return NextResponse.json(
      { error: "Failed to fetch landing timeline" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// route.ts
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const states = body.states ?? body;

    if (!Array.isArray(states)) {
      return NextResponse.json(
        { error: "Invalid request: states must be an array" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (states.length === 0 || states.length > 3) {
      return NextResponse.json(
        { error: "Timeline must have between 1 and 3 sections" },
        { status: 400, headers: corsHeaders },
      );
    }

    for (const state of states) {
      if (!state.key || !state.label || !state.titleLine1 || !state.desc) {
        return NextResponse.json(
          {
            error:
              "Each state must have key, label, titleLine1, and desc (titleLine2 is optional)",
          },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    const incomingKeys = states.map((s: { key: string }) => s.key);

    // Atomic transaction: delete stale + upsert current
    const result = await prisma.$transaction(async (tx) => {
      // Delete keys not present in the incoming request
      await tx.landingTimeline.deleteMany({
        where: {
          key: {
            notIn: incomingKeys,
          },
        },
      });

      // Upsert all incoming states with their new order
      const upsertOps = states.map((state: LandingTimeline, index: number) =>
        tx.landingTimeline.upsert({
          where: { key: state.key },
          create: {
            key: state.key,
            label: state.label,
            titleLine1: state.titleLine1.trim(),
            titleLine2: state.titleLine2?.trim() || null,
            desc: state.desc,
            order: index + 1,
          },
          update: {
            label: state.label,
            titleLine1: state.titleLine1.trim(),
            titleLine2: state.titleLine2?.trim() || null,
            desc: state.desc,
            order: index + 1,
          },
        }),
      );

      return Promise.all(upsertOps);
    });

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
