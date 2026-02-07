// src/schemas/cta.ts
import { z } from "zod";
import { zNonEmpty, zPathOrUrl, type Infer } from "./common";

// Matches LandingCta type in dashboard + Prisma LandingCta model [file:1]
export const landingCtaUpdateSchema = z.object({
  headingLine1: zNonEmpty,
  headingLine2: zNonEmpty,
  subhead: zNonEmpty,
  body: zNonEmpty, // allows multi-line text; no extra constraints
  primaryLabel: zNonEmpty,
  primaryHref: zPathOrUrl,
  secondaryLabel: zNonEmpty,
  secondaryHref: zPathOrUrl,
});

export type LandingCtaUpdateInput = Infer<typeof landingCtaUpdateSchema>;
