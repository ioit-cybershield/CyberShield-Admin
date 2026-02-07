// src/services/footerService.ts
import { prisma } from "@/lib/prisma";
import type {
  FooterUpdateInput,
  LegalLink,
  SocialLink,
} from "@/schemas/footer";
import { FOOTER_ID } from "@/static/footerDefaults";

// Fetch footer by fixed ID, no auto-seeding
export async function getFooter() {
  return prisma.landingFooter.findUnique({
    where: { id: FOOTER_ID },
  });
}

// Upsert footer with normalized links; caller must provide validated input
export async function upsertFooter(input: FooterUpdateInput) {
  const legal: LegalLink[] = (input.legalLinks ?? [])
    .map((item, index) => ({
      id: item.id?.trim() || `legal-${index}`,
      label: item.label.trim(),
      href: item.href.trim(),
      order: item.order ?? index + 1,
    }))
    .sort((a, b) => a.order - b.order);

  const socials: SocialLink[] = (input.socialLinks ?? [])
    .map((item, index) => {
      const platform = item.platform.trim() || "custom";
      const label = (item.label ?? platform).trim();
      return {
        id: item.id?.trim() || `social-${index}`,
        platform,
        label,
        href: item.href.trim(),
        order: item.order ?? index + 1,
      };
    })
    .sort((a, b) => a.order - b.order);

  const footer = await prisma.landingFooter.upsert({
    where: { id: FOOTER_ID },
    create: {
      id: FOOTER_ID,
      ...input,
      legalLinks: legal,
      socialLinks: socials,
    },
    update: {
      ...input,
      legalLinks: legal,
      socialLinks: socials,
    },
  });

  return footer;
}
