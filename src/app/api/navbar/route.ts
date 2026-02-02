// src/app/api/navbar/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.navbar.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    items: {
      id?: string;
      key: string;
      label: string;
      href?: string;
      order: number;
      isActive?: boolean;
    }[];
  };

  // Simple upsert loop – you can optimize later.
  const ops = body.items.map((item) =>
    prisma.navbar.upsert({
      where: { key: item.key },
      create: {
        key: item.key,
        label: item.label,
        href: item.href ?? null,
        order: item.order,
        isActive: item.isActive ?? true,
      },
      update: {
        label: item.label,
        href: item.href ?? null,
        order: item.order,
        isActive: item.isActive ?? true,
      },
    }),
  );

  const result = await prisma.$transaction(ops);

  return NextResponse.json({ items: result });
}
