// src/app/api/landing/hero/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    let hero = await prisma.landingHero.findFirst();

    // Seed a default row if it doesn't exist yet
    if (!hero) {
      hero = await prisma.landingHero.create({
        data: {
          titleLine1: "Cyber-Security",
          titleLine2: "FOR",
          titleLine3: "Everyone",
          bottomLine1: "EMPOWERING A COMMUNITY",
          bottomLine2: "WHERE STUDENTS CONNECT, LEARN & LEAD",
          primaryLabel: "Join CyberShield",
          primaryHref: "/contact",
          secondaryLabel: "View upcoming events",
          secondaryHref: "/events",
        },
      });
    }

    return NextResponse.json({ hero }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      titleLine1,
      titleLine2,
      titleLine3,
      bottomLine1,
      bottomLine2,
      primaryLabel,
      primaryHref,
      secondaryLabel,
      secondaryHref,
    } = body;

    // Minimal validation
    if (
      !titleLine1 ||
      !titleLine2 ||
      !titleLine3 ||
      !bottomLine1 ||
      !bottomLine2 ||
      !primaryLabel ||
      !primaryHref ||
      !secondaryLabel ||
      !secondaryHref
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.landingHero.findFirst();

    const hero = existing
      ? await prisma.landingHero.update({
          where: { id: existing.id },
          data: {
            titleLine1,
            titleLine2,
            titleLine3,
            bottomLine1,
            bottomLine2,
            primaryLabel,
            primaryHref,
            secondaryLabel,
            secondaryHref,
          },
        })
      : await prisma.landingHero.create({
          data: {
            titleLine1,
            titleLine2,
            titleLine3,
            bottomLine1,
            bottomLine2,
            primaryLabel,
            primaryHref,
            secondaryLabel,
            secondaryHref,
          },
        });

    return NextResponse.json({ hero }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error updating landing hero:", error);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500, headers: corsHeaders },
    );
  }
}
