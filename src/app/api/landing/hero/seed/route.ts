// src/app/api/landing/hero/seed/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_HERO = {
  titleLine1: "Cyber-Security",
  titleLine2: "FOR",
  titleLine3: "Everyone",
  bottomLine1: "EMPOWERING A COMMUNITY",
  bottomLine2: "WHERE STUDENTS CONNECT, LEARN & LEAD",
  primaryLabel: "Join CyberShield",
  primaryHref: "/contact",
  secondaryLabel: "View upcoming events",
  secondaryHref: "/events",
};

export async function POST() {
  try {
    // Use a fixed id so repeated seeds just update the same row
    const hero = await prisma.landingHero.upsert({
      where: { id: "landing-hero-default" },
      create: {
        id: "landing-hero-default",
        ...DEFAULT_HERO,
      },
      update: DEFAULT_HERO,
    });

    return NextResponse.json(
      {
        message: "Landing hero seeded successfully",
        hero,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding landing hero:", error);
    return NextResponse.json(
      { error: "Failed to seed landing hero" },
      { status: 500 },
    );
  }
}
