import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_TIMELINE_STATES = [
  {
    key: "past",
    order: 1,
    label: "Past",
    titleLine1: "Early days",
    titleLine2: "of CyberShield",
    desc: "How the club started, first meetups, and initial workshops.",
  },
  {
    key: "today",
    order: 2,
    label: "Today",
    titleLine1: "Active community",
    titleLine2: "learning by doing",
    desc: "Regular workshops, CTFs, awareness sessions and internal projects.",
  },
  {
    key: "future",
    order: 3,
    label: "Future",
    titleLine1: "Scaling impact",
    titleLine2: "across the campus",
    desc: "Collaborations, intercollege events, research and advanced tracks.",
  },
];

export async function POST() {
  try {
    const ops = DEFAULT_TIMELINE_STATES.map((state) =>
      prisma.landingTimeline.upsert({
        where: { key: state.key },
        create: state,
        update: state,
      }),
    );

    const timeline = await prisma.$transaction(ops);

    return NextResponse.json(
      { message: "Landing timeline seeded successfully", states: timeline },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding landing timeline", error);
    return NextResponse.json(
      { error: "Failed to seed landing timeline" },
      { status: 500 },
    );
  }
}
