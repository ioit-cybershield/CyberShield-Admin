// src/schemas/hero.ts
import { z } from "zod";
import { zNonEmpty, zPathOrUrl, type Infer } from "./common";

// Payload used by /api/landing/hero PUT and the dashboard hero editor [file:1]
export const landingHeroUpdateSchema = z.object({
  titleLine1: zNonEmpty,
  titleLine2: zNonEmpty,
  titleLine3: zNonEmpty,
  bottomLine1: zNonEmpty,
  bottomLine2: zNonEmpty,
  primaryLabel: zNonEmpty,
  primaryHref: zPathOrUrl,
  secondaryLabel: zNonEmpty,
  secondaryHref: zPathOrUrl,
});

export type LandingHeroUpdateInput = Infer<typeof landingHeroUpdateSchema>;
