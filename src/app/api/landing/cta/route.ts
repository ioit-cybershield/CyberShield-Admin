// src/app/api/landing/cta/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CTA_ID = "landing-cta-default";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? (process.env.PUBLIC_SITE_ORIGIN ?? "https://ioit-cybershield.github.io")
      : "http://localhost:4321",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Default values matching your current CTA copy
function getDefaultCtaData() {
  return {
    id: CTA_ID,
    headingLine1: "You don’t get many",
    headingLine2: "chances to be early.",
    subhead: "To lead, not follow.",
    body:
      "To shape what cybersecurity becomes — not just adapt to it.\n\n" +
      "CYBERSHIELD IS ALREADY IN THE HANDS OF TEAMS REWRITING THE RULES. " +
      "IF YOU’RE READY, WE’LL MAKE ROOM FOR YOU.",
    primaryLabel: "REQUEST ACCESS >>",
    primaryHref: "/request-access",
    secondaryLabel: "TALK TO OUR TEAM >>",
    secondaryHref: "/contact",
  };
}

// GET: fetch CTA, auto-seed if missing
export async function GET() {
  try {
    let cta = await prisma.landingCta.findUnique({
      where: { id: CTA_ID },
    });

    if (!cta) {
      const defaults = getDefaultCtaData();
      cta = await prisma.landingCta.create({ data: defaults });
    }

    return NextResponse.json({ cta }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing CTA", error);
    return NextResponse.json(
      { error: "Failed to fetch landing CTA" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: update CTA
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      headingLine1,
      headingLine2,
      subhead,
      body: bodyText,
      primaryLabel,
      primaryHref,
      secondaryLabel,
      secondaryHref,
    } = body;

    // Minimal validation: all fields required for now
    const required: [string, unknown][] = [
      ["headingLine1", headingLine1],
      ["headingLine2", headingLine2],
      ["subhead", subhead],
      ["body", bodyText],
      ["primaryLabel", primaryLabel],
      ["primaryHref", primaryHref],
      ["secondaryLabel", secondaryLabel],
      ["secondaryHref", secondaryHref],
    ];

    for (const [field, value] of required) {
      if (typeof value !== "string" || !value.trim().length) {
        return NextResponse.json(
          { error: `Field "${field}" is required` },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    const cta = await prisma.landingCta.upsert({
      where: { id: CTA_ID },
      create: {
        id: CTA_ID,
        headingLine1,
        headingLine2,
        subhead,
        body: bodyText,
        primaryLabel,
        primaryHref,
        secondaryLabel,
        secondaryHref,
      },
      update: {
        headingLine1,
        headingLine2,
        subhead,
        body: bodyText,
        primaryLabel,
        primaryHref,
        secondaryLabel,
        secondaryHref,
      },
    });

    return NextResponse.json({ cta }, { status: 200, headers: corsHeaders });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating landing CTA", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing CTA";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
