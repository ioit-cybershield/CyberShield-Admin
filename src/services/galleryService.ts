// src/services/galleryService.ts
import { prisma } from "@/lib/prisma";
import type { GalleryItemInput } from "@/schemas/gallery";

const MAX_GALLERY_SLOTS = 3;

export async function listGalleryItems(options?: { landingOnly?: boolean }) {
  const landingOnly = options?.landingOnly ?? false;

  const where = landingOnly
    ? {
        slot: { not: null },
        isVisible: true,
      }
    : {};

  return prisma.landingGalleryItem.findMany({
    where,
    orderBy: [{ slot: "asc" }, { createdAt: "asc" }],
  });
}

export async function upsertGalleryItems(items: GalleryItemInput[]) {
  const usedSlots = new Set<number>();

  // Enforce required fields + slot constraints
  for (const item of items) {
    if (
      !item.title ||
      !item.description ||
      !item.imageBlobPath ||
      !item.imageAlt
    ) {
      throw new Error(
        "title, description, imageBlobPath, and imageAlt are required for each gallery item",
      );
    }

    if (item.slot != null) {
      if (item.slot < 1 || item.slot > MAX_GALLERY_SLOTS) {
        throw new Error(`slot must be between 1 and ${MAX_GALLERY_SLOTS}`);
      }
      if (usedSlots.has(item.slot)) {
        throw new Error(`Duplicate slot ${item.slot} is not allowed`);
      }
      usedSlots.add(item.slot);
    }
  }

  const operations = items.map((item) => {
    const data = {
      title: item.title,
      subtitle: item.subtitle ?? null,
      description: item.description,
      // In your current route tags is persisted as a string [file:1],
      // while the dashboard treats it as string[] and serializes to comma-separated.
      tags: item.tags ?? "",
      buttonLabel: item.buttonLabel ?? null,
      buttonHref: item.buttonHref ?? null,
      imageUrl: item.imageUrl,
      imageBlobPath: item.imageBlobPath,
      imageAlt: item.imageAlt,
      slot: item.slot ?? null,
      isVisible: item.isVisible ?? true,
    };

    if (item.id) {
      return prisma.landingGalleryItem.upsert({
        where: { id: item.id },
        create: { id: item.id, ...data },
        update: data,
      });
    }

    return prisma.landingGalleryItem.create({ data });
  });

  return prisma.$transaction(operations);
}
