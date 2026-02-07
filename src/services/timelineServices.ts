// src/services/timelineService.ts
import { prisma } from "@/lib/prisma";
import type { TimelineStateInput } from "@/schemas/timeline";

export async function listTimelineStates() {
  return prisma.landingTimeline.findMany({
    orderBy: { order: "asc" },
  });
}

export async function upsertTimelineStates(states: TimelineStateInput[]) {
  if (states.length === 0 || states.length > 3) {
    throw new Error("Timeline must have between 1 and 3 sections");
  }

  const incomingKeys = states.map((s) => s.key);

  const result = await prisma.$transaction(async (tx) => {
    // Delete keys not present in the incoming request
    await tx.landingTimeline.deleteMany({
      where: {
        key: {
          notIn: incomingKeys,
        },
      },
    });

    // Upsert all incoming states with their new order
    const upsertOps = states.map((state, index) =>
      tx.landingTimeline.upsert({
        where: { key: state.key },
        create: {
          key: state.key,
          label: state.label,
          titleLine1: state.titleLine1.trim(),
          titleLine2: state.titleLine2?.trim() || null,
          desc: state.desc,
          order: index + 1,
        },
        update: {
          label: state.label,
          titleLine1: state.titleLine1.trim(),
          titleLine2: state.titleLine2?.trim() || null,
          desc: state.desc,
          order: index + 1,
        },
      }),
    );

    return Promise.all(upsertOps);
  });

  return result;
}
