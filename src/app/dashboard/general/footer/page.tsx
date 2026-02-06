/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/general/footer/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { RebuildButton } from "@/components/RebuildButton";

type LegalLink = {
  id: string;
  label: string;
  href: string;
  order: number;
};

type SocialLink = {
  id: string;
  platform: string; // "x" | "linkedin" | "instagram" | "github" | "discord" | "custom" | ...
  label: string;
  href: string;
  order: number;
};

type FooterPayload = {
  id?: string;

  gridLink1Label: string;
  gridLink1Href: string;
  gridLink2Label: string;
  gridLink2Href: string;
  gridLink3Label: string;
  gridLink3Href: string;
  gridLink4Label: string;
  gridLink4Href: string;

  homeLinkLabel: string;
  homeLinkHref: string;

  copyrightText: string;

  legalLinks: LegalLink[];
  socialLinks: SocialLink[];
};

const DEFAULT_FOOTER: FooterPayload = {
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

  legalLinks: [
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
  ],
  socialLinks: [
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
  ],
};

function normalizeLegalLinks(raw: any): LegalLink[] {
  if (!Array.isArray(raw)) return DEFAULT_FOOTER.legalLinks;
  const items: LegalLink[] = raw.map((item: any, index: number) => {
    const id =
      typeof item.id === "string" && item.id.trim()
        ? item.id
        : `legal-${index}`;
    const label = String(item.label ?? "").trim();
    const href = String(item.href ?? "").trim();
    const order = Number.isFinite(item.order) ? Number(item.order) : index + 1;
    return { id, label, href, order };
  });
  return items
    .filter((l) => l.label && l.href)
    .sort((a, b) => a.order - b.order);
}

function normalizeSocialLinks(raw: any): SocialLink[] {
  if (!Array.isArray(raw)) return DEFAULT_FOOTER.socialLinks;
  const items: SocialLink[] = raw.map((item: any, index: number) => {
    const id =
      typeof item.id === "string" && item.id.trim()
        ? item.id
        : `social-${index}`;
    const platform = String(item.platform ?? "").trim() || "custom";
    const label = String(item.label ?? "").trim() || platform;
    const href = String(item.href ?? "").trim();
    const order = Number.isFinite(item.order) ? Number(item.order) : index + 1;
    return { id, platform, label, href, order };
  });
  return items.filter((s) => s.href).sort((a, b) => a.order - b.order);
}

// --- Icons copied/adapted from public Footer for visual parity ---

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="17" y1="11" x2="7" y2="11" />
    <line x1="17" y1="7" x2="17" y2="17" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.52373 6.77569L15.4811 0H14.0699L8.89493 5.88203L4.7648 0H0L6.24693 8.89552L0 16H1.4112L6.87253 9.78704L11.2352 16H16M1.92053 1.04127H4.08853L14.0688 15.0099H11.9003" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 14 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.13073 4.375H0V14.0003H3.13073V4.375Z" />
    <path d="M11.6585 4.48788C11.6252 4.47738 11.5937 4.466 11.5587 4.45638C11.5167 4.44675 11.4747 4.43888 11.4318 4.43188C11.2656 4.39863 11.0836 4.375 10.8701 4.375C9.04485 4.375 7.88723 5.70241 7.50573 6.21518V4.375H4.375V14.0003H7.50573V8.75013C7.50573 8.75013 9.87172 5.45478 10.8701 7.87511C10.8701 10.0355 10.8701 14.0003 10.8701 14.0003H13.9999V7.50497C13.9999 6.05068 13.0033 4.83876 11.6585 4.48788Z" />
    <path d="M1.53124 3.06259C2.37692 3.06259 3.06248 2.37701 3.06248 1.5313C3.06248 0.685585 2.37692 0 1.53124 0C0.68556 0 0 0.685585 0 1.5313C0 2.37701 0.68556 3.06259 1.53124 3.06259Z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Simple GitHub + Discord placeholders for preview
const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={
      "flex items-center justify-center rounded-full bg-white text-black " +
      (className ?? "")
    }
  >
    <span className="text-[9px] font-bold">GH</span>
  </div>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={
      "flex items-center justify-center rounded-full bg-indigo-500 text-white " +
      (className ?? "")
    }
  >
    <span className="text-[9px] font-bold">DC</span>
  </div>
);

// Map social platform -> icon component
function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const key = platform.toLowerCase();
  if (key === "x" || key === "twitter") return <XIcon className={className} />;
  if (key === "linkedin") return <LinkedInIcon className={className} />;
  if (key === "instagram") return <InstagramIcon className={className} />;
  if (key === "github") return <GitHubIcon className={className} />;
  if (key === "discord") return <DiscordIcon className={className} />;
  return (
    <div
      className={
        "flex items-center justify-center rounded-full border border-white50 " +
        (className ?? "")
      }
    >
      <span className="text-[9px] font-bold uppercase">
        {platform.slice(0, 2)}
      </span>
    </div>
  );
}

// --- Live preview component (lightweight clone of public footer) ---

interface FooterPreviewProps {
  footer: FooterPayload;
}

const FooterPreview: React.FC<FooterPreviewProps> = ({ footer }) => {
  const gridLinks = [
    { label: footer.gridLink1Label, href: footer.gridLink1Href },
    { label: footer.gridLink2Label, href: footer.gridLink2Href },
    { label: footer.gridLink3Label, href: footer.gridLink3Href },
    { label: footer.gridLink4Label, href: footer.gridLink4Href },
  ];

  const legalLinks = [...footer.legalLinks].sort((a, b) => a.order - b.order);
  const socialLinks = [...footer.socialLinks].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-[#111111] text-white font-nav">
      {/* Label */}
      <div className="border-b border-white/10 bg-black/40 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/60">
        Footer live preview
      </div>

      <footer className="w-full">
        {/* Navigation Grid */}
        <div className="grid w-full grid-cols-1 border-2 border-neutral-800 md:grid-cols-4">
          {gridLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="grid-link-item group relative block h-32 w-full overflow-hidden border-b border-neutral-800 p-4 transition-colors duration-300 last:border-b-0 md:h-64 md:border-b-0 md:border-r last:md:border-r-0"
            >
              <div className="absolute inset-0 z-0 origin-left -translate-x-full bg-[#E2F949] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <div className="flex w-full items-end justify-between">
                  <span className="space-x-1 text-3xl font-bold leading-[0.9] tracking-tight md:text-5xl">
                    {link.label}
                  </span>
                  <ArrowIcon className="mb-1 h-6 w-6 transform transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 md:h-10 md:w-10" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-6 px-6 md:pt-10 md:px-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-center md:gap-6">
            <a
              href={footer.homeLinkHref}
              className="text-lg text-[#E2F949] transition-colors hover:text-white hover:underline"
            >
              {footer.homeLinkLabel}
            </a>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
              {legalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-6 pb-6 text-xs font-mono text-neutral-500 md:flex-row md:gap-8 md:pb-10">
            <div className="w-full text-center md:w-1/3 md:text-left">
              {footer.copyrightText}
            </div>

            {/* Logo placeholder */}
            <div className="flex w-full justify-center md:w-1/3">
              <div className="mb-4 h-14 w-14 rounded-full border border-white/30 bg-white/5 md:mb-0 md:h-20 md:w-20" />
            </div>

            <div className="flex w-full justify-center gap-6 text-white md:w-1/3 md:justify-end">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="transition-colors hover:text-[#E2F949]"
                  aria-label={link.label}
                >
                  <SocialIcon
                    platform={link.platform}
                    className="h-4 w-4 md:h-4 md:w-4"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function FooterEditorPage() {
  const router = useRouter();

  const [footer, setFooter] = useState<FooterPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await fetch("/api/general/footer", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch footer");
        const data = await res.json();
        const f = data.footer ?? data;

        const payload: FooterPayload = {
          id: f.id,
          gridLink1Label: f.gridLink1Label ?? DEFAULT_FOOTER.gridLink1Label,
          gridLink1Href: f.gridLink1Href ?? DEFAULT_FOOTER.gridLink1Href,
          gridLink2Label: f.gridLink2Label ?? DEFAULT_FOOTER.gridLink2Label,
          gridLink2Href: f.gridLink2Href ?? DEFAULT_FOOTER.gridLink2Href,
          gridLink3Label: f.gridLink3Label ?? DEFAULT_FOOTER.gridLink3Label,
          gridLink3Href: f.gridLink3Href ?? DEFAULT_FOOTER.gridLink3Href,
          gridLink4Label: f.gridLink4Label ?? DEFAULT_FOOTER.gridLink4Label,
          gridLink4Href: f.gridLink4Href ?? DEFAULT_FOOTER.gridLink4Href,
          homeLinkLabel: f.homeLinkLabel ?? DEFAULT_FOOTER.homeLinkLabel,
          homeLinkHref: f.homeLinkHref ?? DEFAULT_FOOTER.homeLinkHref,
          copyrightText: f.copyrightText ?? DEFAULT_FOOTER.copyrightText,
          legalLinks: normalizeLegalLinks(f.legalLinks),
          socialLinks: normalizeSocialLinks(f.socialLinks),
        };

        setFooter(payload);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load footer content");
        setFooter(DEFAULT_FOOTER);
      } finally {
        setIsLoading(false);
      }
    }

    loadFooter();
  }, []);

  const handleFieldChange = <K extends keyof FooterPayload>(
    key: K,
    value: FooterPayload[K],
  ) => {
    setFooter((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleLegalChange = (index: number, patch: Partial<LegalLink>) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const next = [...prev.legalLinks];
      next[index] = { ...next[index], ...patch };
      return { ...prev, legalLinks: next };
    });
  };

  const handleAddLegal = () => {
    setFooter((prev) => {
      if (!prev) return prev;
      const nextOrder =
        prev.legalLinks.length > 0
          ? Math.max(...prev.legalLinks.map((l) => l.order)) + 1
          : 1;
      const next: LegalLink = {
        id: `legal-${Date.now()}`,
        label: "New link",
        href: "/",
        order: nextOrder,
      };
      return { ...prev, legalLinks: [...prev.legalLinks, next] };
    });
  };

  const handleRemoveLegal = (index: number) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const next = prev.legalLinks.filter((_, i) => i !== index);
      return { ...prev, legalLinks: next };
    });
  };

  const moveItem = <T,>(arr: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= arr.length) return arr;
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  };

  const handleMoveLegal = (index: number, direction: -1 | 1) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const nextList = moveItem(prev.legalLinks, index, index + direction).map(
        (item, i) => ({ ...item, order: i + 1 }),
      );
      return { ...prev, legalLinks: nextList };
    });
  };

  const handleSocialChange = (index: number, patch: Partial<SocialLink>) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const next = [...prev.socialLinks];
      next[index] = { ...next[index], ...patch };
      return { ...prev, socialLinks: next };
    });
  };

  const handleAddSocial = () => {
    setFooter((prev) => {
      if (!prev) return prev;
      const nextOrder =
        prev.socialLinks.length > 0
          ? Math.max(...prev.socialLinks.map((s) => s.order)) + 1
          : 1;
      const next: SocialLink = {
        id: `social-${Date.now()}`,
        platform: "x",
        label: "Follow us on X",
        href: "https://x.com",
        order: nextOrder,
      };
      return { ...prev, socialLinks: [...prev.socialLinks, next] };
    });
  };

  const handleRemoveSocial = (index: number) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const next = prev.socialLinks.filter((_, i) => i !== index);
      return { ...prev, socialLinks: next };
    });
  };

  const handleMoveSocial = (index: number, direction: -1 | 1) => {
    setFooter((prev) => {
      if (!prev) return prev;
      const nextList = moveItem(prev.socialLinks, index, index + direction).map(
        (item, i) => ({ ...item, order: i + 1 }),
      );
      return { ...prev, socialLinks: nextList };
    });
  };

  const handleSave = async () => {
    if (!footer) return;
    setIsSaving(true);
    try {
      const { id, ...rest } = footer;

      const payload = {
        ...rest,
        legalLinks: footer.legalLinks.map((l, index) => ({
          ...l,
          order: index + 1,
        })),
        socialLinks: footer.socialLinks.map((s, index) => ({
          ...s,
          order: index + 1,
        })),
      };

      const res = await fetch("/api/general/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save footer");
      }

      const data = await res.json();
      const f = data.footer ?? data;

      setFooter({
        id: f.id,
        gridLink1Label: f.gridLink1Label,
        gridLink1Href: f.gridLink1Href,
        gridLink2Label: f.gridLink2Label,
        gridLink2Href: f.gridLink2Href,
        gridLink3Label: f.gridLink3Label,
        gridLink3Href: f.gridLink3Href,
        gridLink4Label: f.gridLink4Label,
        gridLink4Href: f.gridLink4Href,
        homeLinkLabel: f.homeLinkLabel,
        homeLinkHref: f.homeLinkHref,
        copyrightText: f.copyrightText,
        legalLinks: normalizeLegalLinks(f.legalLinks),
        socialLinks: normalizeSocialLinks(f.socialLinks),
      });

      toast.success("Footer saved successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to save footer");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !footer) {
    return (
      <>
        <Toaster position="bottom-right" />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <p className="text-sm text-black/60">Loading footer content...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-black">
                  Site Footer Editor
                </h1>
                <p className="mt-0.5 text-xs text-black/50">
                  Manage the links and content used in the footer on every page.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <RebuildButton size="sm" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)]">
          {/* Form column */}
          <section className="space-y-6">
            {/* Grid links */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Navigation grid
              </h2>
              <p className="mb-4 text-xs text-black/50">
                These four tiles appear at the top of the footer. Their order is
                fixed in the layout.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    keyLabel: "gridLink1Label",
                    keyHref: "gridLink1Href",
                    name: "Tile 1",
                  },
                  {
                    keyLabel: "gridLink2Label",
                    keyHref: "gridLink2Href",
                    name: "Tile 2",
                  },
                  {
                    keyLabel: "gridLink3Label",
                    keyHref: "gridLink3Href",
                    name: "Tile 3",
                  },
                  {
                    keyLabel: "gridLink4Label",
                    keyHref: "gridLink4Href",
                    name: "Tile 4",
                  },
                ].map((cfg) => {
                  const labelKey = cfg.keyLabel as keyof FooterPayload;
                  const hrefKey = cfg.keyHref as keyof FooterPayload;
                  return (
                    <div
                      key={cfg.keyLabel}
                      className="rounded-xl border border-black/10 bg-black/[0.02] p-4"
                    >
                      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.16em] text-black/40">
                        {cfg.name}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Label
                          </label>
                          <input
                            type="text"
                            value={footer[labelKey] as string}
                            onChange={(e) =>
                              handleFieldChange(labelKey, e.target.value as any)
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Path
                          </label>
                          <input
                            type="text"
                            value={footer[hrefKey] as string}
                            onChange={(e) =>
                              handleFieldChange(hrefKey, e.target.value as any)
                            }
                            placeholder="/events"
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Home + copyright */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Main footer info
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                      Home link label
                    </label>
                    <input
                      type="text"
                      value={footer.homeLinkLabel}
                      onChange={(e) =>
                        handleFieldChange("homeLinkLabel", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                      Home link path
                    </label>
                    <input
                      type="text"
                      value={footer.homeLinkHref}
                      onChange={(e) =>
                        handleFieldChange("homeLinkHref", e.target.value)
                      }
                      placeholder="/"
                      className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                    Copyright text
                  </label>
                  <textarea
                    value={footer.copyrightText}
                    onChange={(e) =>
                      handleFieldChange("copyrightText", e.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Legal links (dynamic list) */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-black/60">
                    Legal links
                  </h2>
                  <p className="mt-1 text-xs text-black/50">
                    Add, remove, or reorder links such as privacy, terms, or
                    scam prevention.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLegal}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black hover:border-black/40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add link
                </button>
              </div>

              <div className="space-y-3">
                {footer.legalLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex flex-col gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono text-black/40 sm:flex-col sm:items-start">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/5 text-[11px]">
                        {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveLegal(index, -1)}
                          disabled={index === 0}
                          className="rounded-md p-1 text-black/40 hover:bg-black/5 disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLegal(index, 1)}
                          disabled={index === footer.legalLinks.length - 1}
                          className="rounded-md p-1 text-black/40 hover:bg-black/5 disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              handleLegalChange(index, {
                                label: e.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Path
                          </label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) =>
                              handleLegalChange(index, {
                                href: e.target.value,
                              })
                            }
                            placeholder="/privacy-policy"
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleRemoveLegal(index)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {footer.legalLinks.length === 0 && (
                  <p className="text-xs text-black/40">
                    No legal links yet. Add at least one to show them in the
                    footer.
                  </p>
                )}
              </div>
            </div>

            {/* Social links (dynamic list) */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-black/60">
                    Social links
                  </h2>
                  <p className="mt-1 text-xs text-black/50">
                    Add, remove, or reorder social profiles. Icons are chosen
                    based on platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSocial}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black hover:border-black/40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add social
                </button>
              </div>

              <div className="space-y-3">
                {footer.socialLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex flex-col gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono text-black/40 sm:flex-col sm:items-start">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/5 text-[11px]">
                        {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSocial(index, -1)}
                          disabled={index === 0}
                          className="rounded-md p-1 text-black/40 hover:bg-black/5 disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSocial(index, 1)}
                          disabled={index === footer.socialLinks.length - 1}
                          className="rounded-md p-1 text-black/40 hover:bg-black/5 disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)]">
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Platform
                          </label>
                          <select
                            value={link.platform}
                            onChange={(e) =>
                              handleSocialChange(index, {
                                platform: e.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          >
                            <option value="x">X (Twitter)</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="instagram">Instagram</option>
                            <option value="github">GitHub</option>
                            <option value="discord">Discord</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Accessible label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              handleSocialChange(index, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Follow us on X"
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                          Profile URL
                        </label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) =>
                            handleSocialChange(index, {
                              href: e.target.value,
                            })
                          }
                          placeholder="https://x.com/your-handle"
                          className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(index)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {footer.socialLinks.length === 0 && (
                  <p className="text-xs text-black/40">
                    No social links yet. Add at least one to show icons in the
                    footer.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Preview column */}
          <section className="lg:sticky lg:top-24 h-fit">
            <FooterPreview footer={footer} />
          </section>
        </main>
      </div>
    </>
  );
}
