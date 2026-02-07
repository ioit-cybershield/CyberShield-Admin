// src/static/aboutDefaults.ts
import type { LandingAboutUpdateInput } from "@/schemas/about";

export const ABOUT_ID = "landing-about-default";

export function getDefaultAboutData(): LandingAboutUpdateInput & {
  id: string;
} {
  return {
    id: ABOUT_ID,
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
}
