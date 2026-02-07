// src/schemas/common.ts
import { z } from "zod";

// Generic ID used across your Prisma models (string-based IDs)
export const zId = z.string().min(1).max(191);

// Generic required non-empty string
export const zNonEmpty = z.string().min(1, "Required");

// URL-ish string; you can tighten to z.string().url() later
export const zPathOrUrl = z.string().min(1, "Required");

// Convenience type helper
export type Infer<T extends z.ZodTypeAny> = z.infer<T>;
