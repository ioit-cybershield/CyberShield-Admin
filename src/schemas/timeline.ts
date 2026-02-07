// src/schemas/timeline.ts
import { z } from "zod";
import { zNonEmpty, type Infer } from "./common";

// Payload for each timeline state; key must be non-empty (past/today/future) [file:1]
export const timelineStateSchema = z.object({
  key: zNonEmpty,
  label: zNonEmpty,
  titleLine1: zNonEmpty,
  titleLine2: z.string().optional().nullable(),
  desc: zNonEmpty,
  // order is managed server-side; don't accept from client
});

// For PUT /api/landing/timeline, which accepts { states } or raw array [file:1]
export const timelineUpdateSchema = z
  .union([
    z.object({ states: z.array(timelineStateSchema) }),
    z.array(timelineStateSchema),
  ])
  .superRefine((value, ctx) => {
    const states = Array.isArray(value) ? value : value.states;
    if (states.length === 0 || states.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Timeline must have between 1 and 3 sections",
      });
    }
  });

export type TimelineStateInput = Infer<typeof timelineStateSchema>;
export type TimelineUpdateInput = Infer<typeof timelineUpdateSchema>;
