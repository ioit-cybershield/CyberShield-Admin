import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch section data by key
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }, // In Next 15+ params is a promise
) {
  const key = (await params).key;

  const section = await prisma.siteSection.findUnique({
    where: { key },
  });

  if (!section) {
    return NextResponse.json({ content: null });
  }

  return NextResponse.json({ content: section.content });
}

// POST: Update/Create section data
export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const key = (await params).key;
  const body = await request.json();

  const section = await prisma.siteSection.upsert({
    where: { key },
    update: {
      content: body.content,
    },
    create: {
      key,
      type: "generic", // You can pass this in body if needed
      content: body.content,
    },
  });

  return NextResponse.json({ success: true, section });
}
