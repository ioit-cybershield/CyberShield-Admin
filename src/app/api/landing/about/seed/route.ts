// src/app/api/landing/about/seed/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_ABOUT = {
  scribbleLabel: "Why CyberShield?",
  headline:
    "Empowering cybersecurity enthusiasts to protect, defend, and lead in the digital world.",

  item1Title: "Enhance cybersecurity skills",
  item1Text:
    "Learn by doing through hands-on workshops, labs, and CTF-style challenges that build practical skills in ethical hacking, network security, and threat mitigation.",

  item2Title: "Promote a security-first mindset",
  item2Text:
    "Stay ahead of emerging threats with talks, demos, and discussions on the latest attacks, defenses, and ethical guidelines in cybersecurity.",

  item3Title: "Foster collaboration and leadership",
  item3Text:
    "Join a supportive community where members share knowledge, work on real-world projects, and connect with experts to solve genuine security challenges.",

  numberLeft: 20,
  numberRight: 25,
};

const ABOUT_ID = "landing-about-default";

export async function POST() {
  try {
    const about = await prisma.landingAbout.upsert({
      where: { id: ABOUT_ID },
      create: { id: ABOUT_ID, ...DEFAULT_ABOUT },
      update: DEFAULT_ABOUT,
    });

    return NextResponse.json(
      {
        message: "Landing about seeded successfully",
        about,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding landing about:", error);
    return NextResponse.json(
      { error: "Failed to seed landing about" },
      { status: 500 },
    );
  }
}
