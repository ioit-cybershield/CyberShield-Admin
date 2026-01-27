// // lib/prisma.ts
// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { PrismaClient } from "@/generated/prisma/client";

// const connectionString = process.env.DATABASE_URL!;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaNeon(pool);

// const prisma = new PrismaClient({ adapter });

// export default prisma;
