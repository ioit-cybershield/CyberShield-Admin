// scripts/create-admin.ts
import "dotenv/config";
// import { prisma } from "@/lib/prisma";
import { auth } from "../src/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Site Admin";

async function main() {
  const admin = await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
  });

  console.log("Admin user created:", admin.user);
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
