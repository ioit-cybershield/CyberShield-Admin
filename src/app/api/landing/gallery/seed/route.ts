// src/app/api/dev/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this runs on the Node.js runtime (important on Vercel)
export const runtime = "nodejs";

export async function POST() {
  // Basic safety: don't allow this in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is disabled in production" },
      { status: 403 },
    );
  }

  try {
    // Clear existing gallery items for now (optional, but keeps things deterministic)
    await prisma.landingGalleryItem.deleteMany();

    const galleryItems = await prisma.landingGalleryItem.createMany({
      data: [
        {
          // IDs reused from your Astro `eventsData` so wiring stays consistent
          id: "intro-ethical-hacking",
          title: "Intro to Ethical Hacking",
          subtitle: "Foundation Workshop",
          description:
            "A guided introduction where members explore recon, basic exploitation, and responsible disclosure in a safe lab environment.",
          tags: ["Beginner", "Offensive Security", "Hands-on"],
          buttonLabel: "View Details",
          buttonHref: "/events/intro-ethical-hacking",

          // For now you can use any Blob image you upload;
          // your mirror script will download these into /public/gallery/[id].ext.
          imageBlobPath: "gallery/intro-ethical-hacking.jpg",
          imageUrl:
            "https://your-blob-account.vercel-storage.com/gallery/intro-ethical-hacking.jpg",
          imageAlt: "Students learning ethical hacking in a lab",

          slot: 1,
          isVisible: true,
        },
        {
          id: "web-security-bootcamp",
          title: "Web Application Security Bootcamp",
          subtitle: "Hands-on Series",
          description:
            "A multi-session deep dive into securing web apps, from auth flaws to injection attacks and secure coding.",
          tags: ["Web Security", "OWASP", "Intermediate"],
          buttonLabel: "View Details",
          buttonHref: "/events/web-security-bootcamp",
          imageBlobPath: "gallery/web-security-bootcamp.jpg",
          imageUrl:
            "https://your-blob-account.vercel-storage.com/gallery/web-security-bootcamp.jpg",
          imageAlt: "Students working on web security labs",
          slot: 2,
          isVisible: true,
        },
        {
          id: "on-campus-ctf",
          title: "On-Campus Capture the Flag",
          subtitle: "Competition",
          description:
            "A team-based CTF with real-world style challenges in web, crypto, forensics and more.",
          tags: ["CTF", "Competition", "Teamwork"],
          buttonLabel: "View Details",
          buttonHref: "/events/on-campus-ctf",
          imageBlobPath: "gallery/on-campus-ctf.jpg",
          imageUrl:
            "https://your-blob-account.vercel-storage.com/gallery/on-campus-ctf.jpg",
          imageAlt: "Teams competing in a capture-the-flag event",
          slot: 3,
          isVisible: true,
        },
      ],
    });

    return NextResponse.json(
      {
        ok: true,
        seeded: {
          galleryItems: galleryItems.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
