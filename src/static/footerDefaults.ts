// src/static/footerDefaults.ts
import type {
  FooterUpdateInput,
  LegalLink,
  SocialLink,
} from "@/schemas/footer";

// Keep the ID here because it's part of your static footer concept
export const FOOTER_ID = "landing-footer-default";

export function getDefaultFooterData(): FooterUpdateInput & { id: string } {
  const legalLinks: LegalLink[] = [
    {
      id: "privacy-policy",
      label: "Privacy Policy",
      href: "/privacy-policy",
      order: 1,
    },
    {
      id: "terms",
      label: "Terms",
      href: "/terms",
      order: 2,
    },
    {
      id: "scam-prevention",
      label: "Scam Prevention",
      href: "/scam-prevention",
      order: 3,
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      id: "x",
      platform: "x",
      label: "Follow us on X",
      href: "https://x.com",
      order: 1,
    },
    {
      id: "linkedin",
      platform: "linkedin",
      label: "Connect on LinkedIn",
      href: "https://linkedin.com",
      order: 2,
    },
    {
      id: "instagram",
      platform: "instagram",
      label: "Follow us on Instagram",
      href: "https://instagram.com",
      order: 3,
    },
  ];

  return {
    id: FOOTER_ID,
    gridLink1Label: "Events",
    gridLink1Href: "/events",
    gridLink2Label: "About Us",
    gridLink2Href: "/about",
    gridLink3Label: "Resources",
    gridLink3Href: "/resources",
    gridLink4Label: "Join Us",
    gridLink4Href: "/contact",
    homeLinkLabel: "Home",
    homeLinkHref: "/",
    copyrightText: "2026 CyberShield. All Rights Reserved.",
    legalLinks,
    socialLinks,
  };
}
