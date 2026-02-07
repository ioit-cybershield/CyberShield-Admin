// src/static/galleryDefaults.ts
import type { GalleryItemInput } from "@/schemas/gallery";

export function getDefaultGalleryItems(): GalleryItemInput[] {
  return [
    {
      id: "intro-ethical-hacking",
      title: "Intro to Ethical Hacking",
      subtitle: "Foundation Workshop",
      description:
        "A guided introduction where members explore recon, basic exploitation, and responsible disclosure in a safe lab environment.",
      tags: ["Beginner", "Offensive Security", "Hands-on"],
      buttonLabel: "View Details",
      buttonHref: "events/intro-ethical-hacking",
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
      buttonHref: "events/web-security-bootcamp",
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
      buttonHref: "events/on-campus-ctf",
      imageBlobPath: "gallery/on-campus-ctf.jpg",
      imageUrl:
        "https://your-blob-account.vercel-storage.com/gallery/on-campus-ctf.jpg",
      imageAlt: "Teams competing in a capture-the-flag event",
      slot: 3,
      isVisible: true,
    },
  ];
}
