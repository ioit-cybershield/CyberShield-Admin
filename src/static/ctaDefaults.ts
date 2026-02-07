// src/static/ctaDefaults.ts
import type { LandingCtaUpdateInput } from "@/schemas/cta";

export const CTA_ID = "landing-cta-default";

export function getDefaultCtaData(): LandingCtaUpdateInput & { id: string } {
  return {
    id: CTA_ID,
    headingLine1: "You dont get many",
    headingLine2: "chances to be early.",
    subhead: "To lead, not follow.",
    body: "To shape what cybersecurity becomes not just adapt to it. CYBERSHIELD IS ALREADY IN THE HANDS OF TEAMS REWRITING THE RULES. IF YOURE READY, WELL MAKE ROOM FOR YOU.",
    primaryLabel: "REQUEST ACCESS",
    primaryHref: "request-access",
    secondaryLabel: "TALK TO OUR TEAM",
    secondaryHref: "contact",
  };
}
