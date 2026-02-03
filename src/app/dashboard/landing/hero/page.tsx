// src/app/dashboard/landing/hero/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { RebuildButton } from "@/components/RebuildButton";

type LandingHero = {
  id: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  bottomLine1: string;
  bottomLine2: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export default function LandingHeroEditorPage() {
  const router = useRouter();
  const [hero, setHero] = useState<LandingHero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/landing/hero");
        if (!res.ok) throw new Error("Failed to fetch hero");
        const data = await res.json();
        setHero(data.hero);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load hero content");
      } finally {
        setIsLoading(false);
      }
    }
    loadHero();
  }, []);

  const handleChange = (field: keyof LandingHero, value: string) => {
    setHero((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!hero) return;
    setIsSaving(true);
    try {
      const { id, ...payload } = hero; // we don't need to send id
      const res = await fetch("/api/landing/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save hero");
      const data = await res.json();
      setHero(data.hero);
      toast.success("Hero content saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save hero");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !hero) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          <p className="text-sm text-black/60">Loading hero...</p>
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
                  Landing Hero
                </h1>
                <p className="mt-0.5 text-xs text-black/50">
                  Edit hero text and CTA links without changing the code.
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
          <section className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Heading
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Title line 1
                  </label>
                  <input
                    type="text"
                    value={hero.titleLine1}
                    onChange={(e) => handleChange("titleLine1", e.target.value)}
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Title line 2
                  </label>
                  <input
                    type="text"
                    value={hero.titleLine2}
                    onChange={(e) => handleChange("titleLine2", e.target.value)}
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Title line 3
                  </label>
                  <input
                    type="text"
                    value={hero.titleLine3}
                    onChange={(e) => handleChange("titleLine3", e.target.value)}
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Bottom text
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Line 1
                  </label>
                  <input
                    type="text"
                    value={hero.bottomLine1}
                    onChange={(e) =>
                      handleChange("bottomLine1", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Line 2
                  </label>
                  <input
                    type="text"
                    value={hero.bottomLine2}
                    onChange={(e) =>
                      handleChange("bottomLine2", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                CTA buttons
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/60">
                    Primary CTA
                  </p>
                  <input
                    type="text"
                    placeholder="Button label"
                    value={hero.primaryLabel}
                    onChange={(e) =>
                      handleChange("primaryLabel", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="href, e.g. /contact"
                    value={hero.primaryHref}
                    onChange={(e) =>
                      handleChange("primaryHref", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/60">
                    Secondary CTA
                  </p>
                  <input
                    type="text"
                    placeholder="Button label"
                    value={hero.secondaryLabel}
                    onChange={(e) =>
                      handleChange("secondaryLabel", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="href, e.g. /events"
                    value={hero.secondaryHref}
                    onChange={(e) =>
                      handleChange("secondaryHref", e.target.value)
                    }
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preview (simple text preview; we can refine later if you’d like) */}
          <section className="h-fit rounded-2xl border border-black/10 bg-[#111111] p-6 text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Live Text Preview
            </p>
            <div className="font-hero flex flex-col gap-4">
              <div className="space-y-1">
                <div className="text-[clamp(3.5rem,10vw,11rem)] font-bold leading-[0.8] tracking-[-0.04em] uppercase">
                  <div>{hero.titleLine1}</div>
                  <div>{hero.titleLine2}</div>
                  <div>{hero.titleLine3}</div>
                </div>
              </div>
              <div className="mt-6 space-y-1 text-sm font-bold uppercase tracking-tight text-white/80">
                <div>{hero.bottomLine1}</div>
                <div>{hero.bottomLine2}</div>
              </div>
              <div className="mt-8 flex flex-col gap-3 md:flex-row">
                <button className="group inline-flex w-full items-center justify-between gap-4 rounded border border-white px-6 py-3 text-xs uppercase tracking-tight transition-colors hover:bg-white hover:text-black md:w-auto md:text-sm">
                  <span>{hero.primaryLabel}</span>
                  <span className="text-[10px] text-white/70 group-hover:text-black">
                    {hero.primaryHref}
                  </span>
                </button>
                <button className="group inline-flex w-full items-center justify-between gap-4 rounded border border-white/40 px-6 py-3 text-xs uppercase tracking-tight text-white/70 transition-colors hover:border-white hover:text-white md:w-auto md:text-sm">
                  <span>{hero.secondaryLabel}</span>
                  <span className="text-[10px] text-white/60 group-hover:text-white">
                    {hero.secondaryHref}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
