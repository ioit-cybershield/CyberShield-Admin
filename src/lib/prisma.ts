// src/lib/prisma.ts
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/generated/prisma/client'

const connectionString = process.env.DATABASE_URL!

// New: give config directly, not { pool }
const adapter = new PrismaNeon({ connectionString })

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
