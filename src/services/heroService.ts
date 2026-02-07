// src/services/heroService.ts
import { prisma } from "@/lib/prisma";
import type { LandingHeroUpdateInput } from "@/schemas/hero";
import { HERO_ID } from "@/static/heroDefaults";

// Fetch hero by fixed ID, no auto-seeding
export async function getHero() {
  return prisma.landingHero.findUnique({
    where: { id: HERO_ID },
  });
}

// Upsert hero content with the canonical ID
export async function upsertHero(input: LandingHeroUpdateInput) {
  const hero = await prisma.landingHero.upsert({
    where: { id: HERO_ID },
    create: {
      id: HERO_ID,
      ...input,
    },
    update: {
      ...input,
    },
  });

  return hero;
}
