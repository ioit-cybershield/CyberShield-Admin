// src/app/dashboard/landing/about/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type AboutPayload = {
  scribbleLabel: string;
  headline: string;
  item1Title: string;
  item1Text: string;
  item2Title: string;
  item2Text: string;
  item3Title: string;
  item3Text: string;
  numberLeft: number;
  numberRight: number;
};

const DEFAULT_ABOUT: AboutPayload = {
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

export default function LandingAboutEditorPage() {
  const router = useRouter();

  const [about, setAbout] = useState<AboutPayload>(DEFAULT_ABOUT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  // Load current About content
  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch("/api/landing/about");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (data.about) {
          setAbout({
            scribbleLabel: data.about.scribbleLabel,
            headline: data.about.headline,
            item1Title: data.about.item1Title,
            item1Text: data.about.item1Text,
            item2Title: data.about.item2Title,
            item2Text: data.about.item2Text,
            item3Title: data.about.item3Title,
            item3Text: data.about.item3Text,
            numberLeft: data.about.numberLeft,
            numberRight: data.about.numberRight,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load About content");
      } finally {
        setIsLoading(false);
      }
    }

    loadAbout();
  }, []);

  const handleChange =
    <K extends keyof AboutPayload>(key: K) =>
    (value: AboutPayload[K]) => {
      setAbout((prev) => ({ ...prev, [key]: value }));
    };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/landing/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("About section saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save About section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRebuild = async () => {
    setIsRebuilding(true);
    try {
      const res = await fetch("/api/rebuild", { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger rebuild");
      toast.success("Site rebuild triggered");
    } catch (error) {
      console.error(error);
      toast.error("Failed to trigger rebuild");
    } finally {
      setIsRebuilding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          <p className="text-sm text-black/60">Loading About section...</p>
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
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-black">
                  Landing About Editor
                </h1>
                <p className="mt-0.5 text-xs text-black/50">
                  Manage the copy used in the About section on the landing page.
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
              <button
                onClick={handleRebuild}
                disabled={isRebuilding}
                className="flex items-center gap-2 rounded-lg border border-black/20 px-4 py-2 text-sm font-medium transition-colors hover:border-black/40 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRebuilding ? "animate-spin" : ""}`}
                />
                Rebuild Site
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto grid max-w-[1800px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Form */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Top Copy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Scribble label
                  </label>
                  <input
                    type="text"
                    value={about.scribbleLabel}
                    onChange={(e) =>
                      handleChange("scribbleLabel")(e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    placeholder="Why CyberShield?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Main headline
                  </label>
                  <textarea
                    value={about.headline}
                    onChange={(e) => handleChange("headline")(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Editorial items
              </h2>
              <div className="space-y-6">
                {[1, 2, 3].map((idx) => {
                  const titleKey = `item${idx}Title` as const;
                  const textKey = `item${idx}Text` as const;

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-black/10 bg-black/2 p-4"
                    >
                      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.16em] text-black/40">
                        Item {idx}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                            Title
                          </label>
                          <input
                            type="text"
                            value={about[titleKey as keyof AboutPayload]}
                            onChange={(e) =>
                              handleChange(titleKey as keyof AboutPayload)(
                                e.target.value,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                            Body
                          </label>
                          <textarea
                            value={about[textKey as keyof AboutPayload]}
                            onChange={(e) =>
                              handleChange(textKey as keyof AboutPayload)(
                                e.target.value,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Heavy numbers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Left number
                  </label>
                  <input
                    type="number"
                    value={about.numberLeft}
                    onChange={(e) =>
                      handleChange("numberLeft")(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                    Right number
                  </label>
                  <input
                    type="number"
                    value={about.numberRight}
                    onChange={(e) =>
                      handleChange("numberRight")(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preview */}
          <section className="lg:sticky lg:top-24 h-fit">
            <AboutPreview about={about} />
          </section>
        </main>
      </div>
    </>
  );
}

function AboutPreview({ about }: { about: AboutPayload }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 bg-black/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
        Landing About – Live preview
      </div>
      <div className="space-y-10 bg-[#f8f5f2] px-6 pb-10 pt-8">
        {/* Scribble + headline */}
        <div className="relative">
          <p className="mb-3 inline-block -rotate-6 translate-x-4 font-serif text-sm italic text-[#f84131]">
            {about.scribbleLabel}
          </p>
          <h3 className="max-w-xl text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            {about.headline}
          </h3>
        </div>

        {/* Items */}
        <div className="space-y-6">
          {[about.item1Title, about.item2Title, about.item3Title].map(
            (title, idx) => {
              const text =
                idx === 0
                  ? about.item1Text
                  : idx === 1
                    ? about.item2Text
                    : about.item3Text;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 gap-y-2 gap-x-8 border-t border-black/10 pt-5 md:grid-cols-12 md:pt-6"
                >
                  <div className="md:col-span-4 lg:col-span-4">
                    <h4 className="text-base font-medium tracking-tight md:text-lg">
                      {title}
                    </h4>
                  </div>
                  <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
                    <p className="text-sm leading-relaxed text-black/70 md:text-base">
                      {text}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Numbers */}
        <div className="flex h-32 items-center justify-center gap-6 overflow-hidden rounded-xl bg-white/60">
          <span className="text-5xl font-bold tracking-tighter text-transparent md:text-6xl">
            <span
              style={{ WebkitTextStroke: "1px #e49700" }}
              className="inline-block"
            >
              {about.numberLeft}
            </span>
          </span>
          <span className="-ml-2 text-5xl font-bold tracking-tighter text-transparent md:text-6xl">
            <span
              style={{ WebkitTextStroke: "1px #e49700" }}
              className="inline-block"
            >
              {about.numberRight}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
