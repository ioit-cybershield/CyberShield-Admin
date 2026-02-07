// src/static/heroDefaults.ts
import type { LandingHeroUpdateInput } from "@/schemas/hero";

// Canonical single-row ID for the hero section
export const HERO_ID = "landing-hero-default";

export function getDefaultHeroData(): LandingHeroUpdateInput & { id: string } {
  return {
    id: HERO_ID,
    titleLine1: "Cyber-Security",
    titleLine2: "FOR",
    titleLine3: "Everyone",
    bottomLine1: "EMPOWERING A COMMUNITY",
    bottomLine2: "WHERE STUDENTS CONNECT, LEARN & LEAD",
    primaryLabel: "Join CyberShield",
    primaryHref: "contact", // matches existing implementation [file:1]
    secondaryLabel: "View upcoming events",
    secondaryHref: "events",
  };
}
