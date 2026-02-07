// src/app/dashboard/landing/cta/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { RebuildButton } from "@/components/RebuildButton";

type LandingCta = {
  id: string;
  headingLine1: string;
  headingLine2: string;
  subhead: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export default function LandingCtaEditorPage() {
  const router = useRouter();
  const [cta, setCta] = useState<LandingCta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCta() {
      try {
        const res = await fetch("/api/landing/cta");
        if (!res.ok) throw new Error("Failed to fetch CTA");
        const data = await res.json();
        const c = data.cta ?? data;
        setCta(c);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load CTA content");
      } finally {
        setIsLoading(false);
      }
    }
    loadCta();
  }, []);

  const handleChange = (field: keyof LandingCta, value: string) => {
    setCta((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!cta) return;
    setIsSaving(true);
    try {
      const { id, ...payload } = cta;
      const res = await fetch("/api/landing/cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save CTA");
      const data = await res.json();
      setCta(data.cta ?? data);
      toast.success("CTA content saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save CTA content");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !cta) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          <p className="text-sm text-black/60">Loading CTA...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-black">
                  Landing CTA
                </h1>
                <p className="mt-0.5 text-xs text-black/50">
                  Edit CTA text and cyber buttons without changing the code.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <RebuildButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
          {/* Form */}
          <section className="space-y-6">
            {/* Top heading */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Top heading
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Heading line 1
                  </label>
                  <input
                    type="text"
                    value={cta.headingLine1}
                    onChange={(e) =>
                      handleChange("headingLine1", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Heading line 2
                  </label>
                  <input
                    type="text"
                    value={cta.headingLine2}
                    onChange={(e) =>
                      handleChange("headingLine2", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom-right block */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Bottom-right block
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Subheading
                  </label>
                  <input
                    type="text"
                    value={cta.subhead}
                    onChange={(e) => handleChange("subhead", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Body copy
                  </label>
                  <textarea
                    value={cta.body}
                    onChange={(e) => handleChange("body", e.target.value)}
                    rows={5}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-black/40">
                    Use blank lines to create paragraph breaks.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Cyber buttons
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/60">
                    Primary button
                  </p>
                  <input
                    type="text"
                    placeholder="Button label"
                    value={cta.primaryLabel}
                    onChange={(e) =>
                      handleChange("primaryLabel", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="href, e.g. /request-access"
                    value={cta.primaryHref}
                    onChange={(e) =>
                      handleChange("primaryHref", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/60">
                    Secondary button
                  </p>
                  <input
                    type="text"
                    placeholder="Button label"
                    value={cta.secondaryLabel}
                    onChange={(e) =>
                      handleChange("secondaryLabel", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="href, e.g. /contact"
                    value={cta.secondaryHref}
                    onChange={(e) =>
                      handleChange("secondaryHref", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preview */}
          <section className="lg:sticky lg:top-24 h-fit">
            <CtaPreview cta={cta} />
          </section>
        </main>
      </div>
    </>
  );
}

type CtaPreviewProps = {
  cta: Omit<LandingCta, "id">;
};

function CtaPreview({ cta }: CtaPreviewProps) {
  const paragraphs = cta.body.split("\n\n");

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 bg-black/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
        Landing CTA – Live preview
      </div>
      <div className="relative aspect-[16/10] bg-[#1B1B1C] text-white">
        {/* Dark overlay to match production feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10">
          {/* Top heading */}
          <div className="max-w-xs">
            <div className="overflow-hidden mb-[-0.4em]">
              <h2 className="block text-[7vw] md:text-[2.8vw] leading-[1.1] font-normal text-[#E2F949] tracking-[-0.02em]">
                {cta.headingLine1}
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="block text-[7vw] md:text-[2.8vw] leading-[1.1] font-normal text-white tracking-[-0.02em]">
                {cta.headingLine2}
              </h2>
            </div>
          </div>

          {/* Bottom-right block */}
          <div className="flex w-full justify-end">
            <div className="max-w-lg text-right space-y-3">
              <div className="overflow-hidden">
                <h2 className="text-[7vw] md:text-[2.4vw] leading-[1.1] font-medium text-white tracking-[-0.01em]">
                  {cta.subhead}
                </h2>
              </div>
              <div className="text-white/85 text-[0.8rem] md:text-[0.9rem] leading-snug">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row justify-end">
                <div className="inline-flex items-center justify-center rounded-md border border-[#00d8cd] bg-[#005eff] px-4 py-2 text-[0.7rem] font-mono font-bold uppercase tracking-[0.16em] text-black shadow-sm">
                  {cta.primaryLabel || "Primary CTA"}
                </div>
                {cta.secondaryLabel.trim().length > 0 && (
                  <div className="inline-flex items-center justify-center rounded-md border border-white/40 px-4 py-2 text-[0.7rem] font-mono font-bold uppercase tracking-[0.16em] text-white/90">
                    {cta.secondaryLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
