// src/schemas/navbar.ts
import { z } from "zod";
import { zId, zNonEmpty, zPathOrUrl, type Infer } from "./common";

// Matches Navbar Prisma model + dashboard navbar editor usage [file:1]
export const navbarItemSchema = z.object({
  id: zId.optional(),
  key: zNonEmpty, // e.g. "events", "gallery", "team", "about"
  label: zNonEmpty,
  href: zPathOrUrl.optional().nullable(),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const navbarUpdateSchema = z.union([
  z.object({ items: z.array(navbarItemSchema) }),
  z.array(navbarItemSchema),
]);

export type NavbarItemInput = Infer<typeof navbarItemSchema>;
export type NavbarUpdateInput = Infer<typeof navbarUpdateSchema>;
