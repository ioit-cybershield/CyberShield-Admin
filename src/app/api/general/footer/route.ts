/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FOOTER_ID = "landing-footer-default";

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

type LegalLink = {
  id: string;
  label: string;
  href: string;
  order: number;
};

type SocialLink = {
  id: string;
  platform: string; // "x" | "linkedin" | "instagram" | "github" | "discord" | "custom" | ...
  label: string;
  href: string;
  order: number;
};

// Default values matching the current public footer
function getDefaultFooterData() {
  const legalLinks: LegalLink[] = [
    {
      id: "privacy-policy",
      label: "Privacy Policy",
      href: "/privacy-policy",
      order: 1,
    },
    {
      id: "terms",
      label: "Terms",
      href: "/terms",
      order: 2,
    },
    {
      id: "scam-prevention",
      label: "Scam Prevention",
      href: "/scam-prevention",
      order: 3,
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      id: "x",
      platform: "x",
      label: "Follow us on X",
      href: "https://x.com",
      order: 1,
    },
    {
      id: "linkedin",
      platform: "linkedin",
      label: "Connect on LinkedIn",
      href: "https://linkedin.com",
      order: 2,
    },
    {
      id: "instagram",
      platform: "instagram",
      label: "Follow us on Instagram",
      href: "https://instagram.com",
      order: 3,
    },
  ];

  return {
    id: FOOTER_ID,

    gridLink1Label: "Events",
    gridLink1Href: "/events",
    gridLink2Label: "About Us",
    gridLink2Href: "/about",
    gridLink3Label: "Resources",
    gridLink3Href: "/resources",
    gridLink4Label: "Join Us",
    gridLink4Href: "/contact",

    homeLinkLabel: "Home",
    homeLinkHref: "/",

    copyrightText: "2026 CyberShield. All Rights Reserved.",

    legalLinks,
    socialLinks,
  };
}

// GET: fetch footer, auto-seed default row if missing
export async function GET() {
  try {
    let footer = await prisma.landingFooter.findUnique({
      where: { id: FOOTER_ID },
    });

    if (!footer) {
      const defaults = getDefaultFooterData();
      footer = await prisma.landingFooter.create({
        data: {
          id: defaults.id,
          gridLink1Label: defaults.gridLink1Label,
          gridLink1Href: defaults.gridLink1Href,
          gridLink2Label: defaults.gridLink2Label,
          gridLink2Href: defaults.gridLink2Href,
          gridLink3Label: defaults.gridLink3Label,
          gridLink3Href: defaults.gridLink3Href,
          gridLink4Label: defaults.gridLink4Label,
          gridLink4Href: defaults.gridLink4Href,
          homeLinkLabel: defaults.homeLinkLabel,
          homeLinkHref: defaults.homeLinkHref,
          copyrightText: defaults.copyrightText,
          legalLinks: defaults.legalLinks,
          socialLinks: defaults.socialLinks,
        },
      });
    }

    return NextResponse.json({ footer }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching landing footer", error);
    return NextResponse.json(
      { error: "Failed to fetch landing footer" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT: update footer (scalar fields + JSON arrays)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      gridLink1Label,
      gridLink1Href,
      gridLink2Label,
      gridLink2Href,
      gridLink3Label,
      gridLink3Href,
      gridLink4Label,
      gridLink4Href,
      homeLinkLabel,
      homeLinkHref,
      copyrightText,
      legalLinks,
      socialLinks,
    } = body;

    // Basic validation for required scalar fields
    const requiredStrings: [string, string][] = [
      ["gridLink1Label", gridLink1Label],
      ["gridLink1Href", gridLink1Href],
      ["gridLink2Label", gridLink2Label],
      ["gridLink2Href", gridLink2Href],
      ["gridLink3Label", gridLink3Label],
      ["gridLink3Href", gridLink3Href],
      ["gridLink4Label", gridLink4Label],
      ["gridLink4Href", gridLink4Href],
      ["homeLinkLabel", homeLinkLabel],
      ["homeLinkHref", homeLinkHref],
      ["copyrightText", copyrightText],
    ];

    for (const [field, value] of requiredStrings) {
      if (typeof value !== "string" || value.trim().length === 0) {
        return NextResponse.json(
          { error: `Field "${field}" is required` },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    // Validate legalLinks array
    let legal: LegalLink[] = [];
    if (legalLinks != null) {
      if (!Array.isArray(legalLinks)) {
        return NextResponse.json(
          { error: "legalLinks must be an array" },
          { status: 400, headers: corsHeaders },
        );
      }

      legal = legalLinks.map((item: LegalLink, index: number) => {
        const id =
          typeof item.id === "string" && item.id.trim()
            ? item.id
            : `legal-${index}`;
        const label = String(item.label ?? "").trim();
        const href = String(item.href ?? "").trim();
        const order = Number.isFinite(item.order)
          ? Number(item.order)
          : index + 1;

        if (!label || !href) {
          throw new Error("Each legal link must have non-empty label and href");
        }

        return { id, label, href, order };
      });

      // Ensure deterministic ordering
      legal.sort((a, b) => a.order - b.order);
    }

    // Validate socialLinks array
    let socials: SocialLink[] = [];
    if (socialLinks != null) {
      if (!Array.isArray(socialLinks)) {
        return NextResponse.json(
          { error: "socialLinks must be an array" },
          { status: 400, headers: corsHeaders },
        );
      }

      socials = socialLinks.map((item: SocialLink, index: number) => {
        const id =
          typeof item.id === "string" && item.id.trim()
            ? item.id
            : `social-${index}`;
        const platform = String(item.platform ?? "").trim() || "custom";
        const label = String(item.label ?? "").trim() || platform;
        const href = String(item.href ?? "").trim();
        const order = Number.isFinite(item.order)
          ? Number(item.order)
          : index + 1;

        if (!href) {
          throw new Error("Each social link must have a non-empty href");
        }

        return { id, platform, label, href, order };
      });

      socials.sort((a, b) => a.order - b.order);
    }

    const footer = await prisma.landingFooter.upsert({
      where: { id: FOOTER_ID },
      create: {
        id: FOOTER_ID,
        gridLink1Label,
        gridLink1Href,
        gridLink2Label,
        gridLink2Href,
        gridLink3Label,
        gridLink3Href,
        gridLink4Label,
        gridLink4Href,
        homeLinkLabel,
        homeLinkHref,
        copyrightText,
        legalLinks: legal,
        socialLinks: socials,
      },
      update: {
        gridLink1Label,
        gridLink1Href,
        gridLink2Label,
        gridLink2Href,
        gridLink3Label,
        gridLink3Href,
        gridLink4Label,
        gridLink4Href,
        homeLinkLabel,
        homeLinkHref,
        copyrightText,
        legalLinks: legal,
        socialLinks: socials,
      },
    });

    return NextResponse.json({ footer }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Error updating landing footer", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Failed to update landing footer";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
