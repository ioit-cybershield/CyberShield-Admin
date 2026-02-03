// src/app/api/navbar/seed/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_NAVBAR_ITEMS = [
  { key: "events", label: "Events", href: "/events", order: 1 },
  { key: "gallery", label: "Gallery", href: "/gallery", order: 2 },
  { key: "team", label: "Team", href: "/team", order: 3 },
  { key: "about", label: "About Us", href: "/about", order: 4 },
];

export async function POST() {
  try {
    const operations = DEFAULT_NAVBAR_ITEMS.map((item) =>
      prisma.navbar.upsert({
        where: { key: item.key },
        create: item,
        update: {},
      }),
    );

    const result = await prisma.$transaction(operations);

    return NextResponse.json(
      { message: "Navbar seeded successfully", items: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding navbar:", error);
    return NextResponse.json(
      { error: "Failed to seed navbar" },
      { status: 500 },
    );
  }
}
