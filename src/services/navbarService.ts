// src/services/navbarService.ts
import { prisma } from "@/lib/prisma";
import type { NavbarItemInput } from "@/schemas/navbar";

export async function listNavbarItems() {
  return prisma.navbar.findMany({
    orderBy: { order: "asc" },
  });
}

export async function upsertNavbarItems(items: NavbarItemInput[]) {
  const keys = items.map((i) => i.key);

  const result = await prisma.$transaction(async (tx) => {
    // Remove items that were deleted in the dashboard
    await tx.navbar.deleteMany({
      where: {
        key: {
          notIn: keys,
        },
      },
    });

    const ops = items.map((item, index) => {
      const normalizedOrder =
        typeof item.order === "number" && item.order >= 0
          ? item.order
          : index + 1;

      const data = {
        label: item.label,
        href: item.href ?? null,
        order: normalizedOrder,
        isActive: item.isActive ?? true,
      };

      return tx.navbar.upsert({
        where: { key: item.key },
        create: {
          key: item.key,
          ...data,
        },
        update: data,
      });
    });

    return Promise.all(ops);
  });

  return result;
}
