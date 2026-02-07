// src/schemas/about.ts
import { z } from "zod";
import { zNonEmpty, type Infer } from "./common";

// Matches AboutPayload in dashboard and LandingAbout Prisma model [file:1]
export const landingAboutUpdateSchema = z.object({
  scribbleLabel: zNonEmpty,
  headline: zNonEmpty,
  item1Title: zNonEmpty,
  item1Text: zNonEmpty,
  item2Title: zNonEmpty,
  item2Text: zNonEmpty,
  item3Title: zNonEmpty,
  item3Text: zNonEmpty,
  numberLeft: z.number().int(),
  numberRight: z.number().int(),
});

export type LandingAboutUpdateInput = Infer<typeof landingAboutUpdateSchema>;
