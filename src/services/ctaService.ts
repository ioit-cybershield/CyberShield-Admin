// src/services/ctaService.ts
import { prisma } from "@/lib/prisma";
import type { LandingCtaUpdateInput } from "@/schemas/cta";
import { CTA_ID } from "@/static/ctaDefaults";

// Fetch CTA row by fixed ID, no auto-seeding
export async function getCta() {
  return prisma.landingCta.findUnique({
    where: { id: CTA_ID },
  });
}

// Upsert CTA content with the canonical ID
export async function upsertCta(input: LandingCtaUpdateInput) {
  const cta = await prisma.landingCta.upsert({
    where: { id: CTA_ID },
    create: {
      id: CTA_ID,
      ...input,
    },
    update: {
      ...input,
    },
  });

  return cta;
}
