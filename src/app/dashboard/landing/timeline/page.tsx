/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { RebuildButton } from "@/components/RebuildButton";

type TimelineEditorState = {
  key: string;
  order: number;
  label: string;
  titleLine1: string;
  titleLine2: string;
  desc: string;
};

const DEFAULT_STATES: TimelineEditorState[] = [
  {
    key: "past",
    order: 1,
    label: "Past",
    titleLine1: "Early days",
    titleLine2: "of CyberShield",
    desc: "How the club started, first meetups, and initial workshops.",
  },
  {
    key: "today",
    order: 2,
    label: "Today",
    titleLine1: "Active community,",
    titleLine2: "learning by doing",
    desc: "Regular workshops, CTFs, awareness sessions and internal projects.",
  },
  {
    key: "future",
    order: 3,
    label: "Future",
    titleLine1: "Scaling impact,",
    titleLine2: "across the campus",
    desc: "Collaborations, intercollege events, research and advanced tracks.",
  },
];

export default function LandingTimelineEditorPage() {
  const router = useRouter();

  const [states, setStates] = useState<TimelineEditorState[]>(DEFAULT_STATES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load current timeline content from API
  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await fetch("/api/landing/timeline", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch timeline");
        }

        const data = await res.json();

        if (
          !data.states ||
          !Array.isArray(data.states) ||
          data.states.length === 0
        ) {
          setStates(DEFAULT_STATES);
          return;
        }

        const mapped: TimelineEditorState[] = data.states
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((state: any) => {
            const rawTitle: string = state.titleLines ?? "";
            const [line1, line2 = ""] = rawTitle
              .split(",", 2)
              .map((s) => s.trim());

            return {
              key: state.key,
              order: typeof state.order === "number" ? state.order : 0,
              label: state.label ?? "",
              titleLine1: line1,
              titleLine2: line2,
              desc: state.desc ?? "",
            };
          });

        setStates(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load timeline content");
        setStates(DEFAULT_STATES);
      } finally {
        setIsLoading(false);
      }
    }

    loadTimeline();
  }, []);

  const handleChange = <K extends keyof TimelineEditorState>(
    index: number,
    field: K,
    value: TimelineEditorState[K],
  ) => {
    setStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, [field]: value } : state,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        states: states.map((s) => ({
          key: s.key,
          order: s.order,
          label: s.label.trim(),
          titleLines: [s.titleLine1, s.titleLine2].filter(Boolean).join(", "),
          desc: s.desc.trim(),
        })),
      };

      const res = await fetch("/api/landing/timeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save timeline");
      }

      toast.success("Timeline content saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save timeline");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Toaster position="bottom-right" />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <p className="text-sm text-black/60">Loading timeline content...</p>
          </div>
        </div>
      </>
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
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-black">
                  Landing Timeline Editor
                </h1>
                <p className="mt-0.5 text-xs text-black/50">
                  Manage the copy used in the spinner timeline on the landing
                  page.
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
        <main className="mx-auto grid max-w-[1800px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Form section */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Timeline stages
              </h2>
              <p className="mb-4 text-xs text-black/60">
                Edit the label, heading and description for each stage. These
                changes will drive the text around the spinner on the landing
                page, while preserving all existing animations.
              </p>

              <div className="space-y-4">
                {states.map((state, index) => (
                  <div
                    key={state.key ?? index}
                    className="rounded-xl border border-black/10 bg-black/2 p-4"
                  >
                    <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.16em] text-black/40">
                      Item {index + 1} · {state.key}
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                      {/* Left side: meta */}
                      <div className="space-y-3 md:col-span-4">
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Label
                          </label>
                          <input
                            type="text"
                            value={state.label}
                            onChange={(e) =>
                              handleChange(index, "label", e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                            placeholder="Past"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Order
                          </label>
                          <input
                            type="number"
                            value={state.order}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "order",
                                Number(e.target.value) || 0,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                            min={0}
                          />
                        </div>
                      </div>

                      {/* Right side: title + body */}
                      <div className="space-y-3 md:col-span-8">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-black/60">
                              Title line 1
                            </label>
                            <input
                              type="text"
                              value={state.titleLine1}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "titleLine1",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                              placeholder="Early days"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-black/60">
                              Title line 2
                            </label>
                            <input
                              type="text"
                              value={state.titleLine2}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "titleLine2",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                              placeholder="of CyberShield"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                            Description
                          </label>
                          <textarea
                            value={state.desc}
                            onChange={(e) =>
                              handleChange(index, "desc", e.target.value)
                            }
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none"
                            placeholder="How the club started, first meetups, and initial workshops."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Preview section */}
          <section className="lg:sticky lg:top-24 h-fit">
            <TimelinePreview states={states} />
          </section>
        </main>
      </div>
    </>
  );
}

function TimelinePreview({ states }: { states: TimelineEditorState[] }) {
  // Sort by order to match frontend behavior
  const ordered = [...states].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 bg-black/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
        Landing Timeline · Live preview
      </div>

      <div className="space-y-6 bg-[#111111] px-6 pb-8 pt-6 text-white">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
          Spinner stages
        </p>

        <div className="space-y-5">
          {ordered.map((state, index) => {
            const isCurrent = index === 1; // visually treat the second item as "active"
            return (
              <div
                key={state.key ?? index}
                className="flex flex-col gap-1 border-l border-white/10 pl-4"
              >
                <span
                  className={[
                    "text-[11px] font-semibold uppercase tracking-[0.2em]",
                    isCurrent ? "text-[#E4B03C]" : "text-white/50",
                  ].join(" ")}
                >
                  {state.label}
                </span>
                <h3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
                  <span className="block">{state.titleLine1}</span>
                  {state.titleLine2 && (
                    <span className="block">{state.titleLine2}</span>
                  )}
                </h3>
                <p className="max-w-md text-xs leading-relaxed text-white/70 md:text-sm">
                  {state.desc}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-[10px] text-white/40">
          This preview matches the text hierarchy and spacing of the landing
          page timeline, while the actual spinner geometry and GSAP animations
          remain implemented in the main site code.
        </p>
      </div>
    </div>
  );
}
