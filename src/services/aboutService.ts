// src/services/aboutService.ts
import { prisma } from "@/lib/prisma";
import type { LandingAboutUpdateInput } from "@/schemas/about";
import { ABOUT_ID } from "@/static/aboutDefaults";

// Fetch about by fixed ID, no auto-seeding
export async function getAbout() {
  return prisma.landingAbout.findUnique({
    where: { id: ABOUT_ID },
  });
}

// Upsert about content with the canonical ID
export async function upsertAbout(input: LandingAboutUpdateInput) {
  const about = await prisma.landingAbout.upsert({
    where: { id: ABOUT_ID },
    create: {
      id: ABOUT_ID,
      ...input,
    },
    update: {
      ...input,
    },
  });

  return about;
}
