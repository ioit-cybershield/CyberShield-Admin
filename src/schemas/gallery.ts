// src/schemas/gallery.ts
import { z } from "zod";
import { zId, zNonEmpty, zPathOrUrl, type Infer } from "./common";

// Mirrors GalleryInput in gallery route + LandingGalleryItem Prisma model [file:1]
export const galleryItemSchema = z.object({
  id: zId.optional(),
  title: zNonEmpty,
  subtitle: z.string().optional().nullable(),
  description: zNonEmpty,
  tags: z.array(z.string()).default([]),
  buttonLabel: z.string().optional().nullable(),
  buttonHref: zPathOrUrl.optional().nullable(),
  imageBlobPath: zNonEmpty,
  imageAlt: zNonEmpty,
  imageUrl: zPathOrUrl, // admin always sends a URL returned from /api/upload
  slot: z.number().int().min(1).max(3).optional().nullable(), // MAX_SLOTS = 3 [file:1]
  isVisible: z.boolean().optional(),
});

// For PUT /api/landing/gallery, which accepts { items } or raw array [file:1]
export const galleryUpdateSchema = z.union([
  z.object({ items: z.array(galleryItemSchema) }),
  z.array(galleryItemSchema),
]);

export type GalleryItemInput = Infer<typeof galleryItemSchema>;
export type GalleryUpdateInput = Infer<typeof galleryUpdateSchema>;
