// src/schemas/footer.ts
import { z } from "zod";
import { zId, zNonEmpty, zPathOrUrl, type Infer } from "./common";

// Matches the JSON shape stored in LandingFooter.legalLinks (array of objects)
// prisma model: LandingFooter.legalLinks Json [file:1]
export const legalLinkSchema = z.object({
  id: zId.optional(), // generated when missing
  label: zNonEmpty,
  href: zPathOrUrl,
  order: z.number().int().positive().optional(),
});

// Matches LandingFooter.socialLinks JSON array [file:1]
export const socialLinkSchema = z.object({
  id: zId.optional(),
  platform: zNonEmpty.default("custom"),
  label: zNonEmpty.optional(), // will default to platform if omitted
  href: zPathOrUrl,
  order: z.number().int().positive().optional(),
});

// Payload your admin UI sends to PUT /api/general/footer
export const footerUpdateSchema = z.object({
  gridLink1Label: zNonEmpty,
  gridLink1Href: zPathOrUrl,
  gridLink2Label: zNonEmpty,
  gridLink2Href: zPathOrUrl,
  gridLink3Label: zNonEmpty,
  gridLink3Href: zPathOrUrl,
  gridLink4Label: zNonEmpty,
  gridLink4Href: zPathOrUrl,
  homeLinkLabel: zNonEmpty,
  homeLinkHref: zPathOrUrl,
  copyrightText: zNonEmpty,
  legalLinks: z.array(legalLinkSchema).default([]),
  socialLinks: z.array(socialLinkSchema).default([]),
});

// Types you can reuse across backend (and later frontend)
export type FooterUpdateInput = Infer<typeof footerUpdateSchema>;
export type LegalLink = Infer<typeof legalLinkSchema>;
export type SocialLink = Infer<typeof socialLinkSchema>;
