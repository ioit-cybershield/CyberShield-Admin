/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { RebuildButton } from "@/components/RebuildButton";

type TimelineEditorState = {
  key: string;
  label: string;
  titleLine1: string;
  titleLine2?: string;
  desc: string;
};

type ApiTimelineState = {
  key: string;
  label: string;
  titleLine1: string;
  titleLine2: string | null;
  desc: string;
  order?: number | null;
};

const DEFAULT_STATES: TimelineEditorState[] = [
  {
    key: "past",
    label: "Past",
    titleLine1: "Early days",
    titleLine2: "of CyberShield",
    desc: "How the club started, first meetups, and initial workshops.",
  },
  {
    key: "today",
    label: "Today",
    titleLine1: "Active community",
    titleLine2: "learning by doing",
    desc: "Regular workshops, CTFs, awareness sessions and internal projects.",
  },
  {
    key: "future",
    label: "Future",
    titleLine1: "Scaling impact",
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

        if (!data.states || !Array.isArray(data.states)) {
          setStates(DEFAULT_STATES);
          return;
        }

        const apiStates = data.states as ApiTimelineState[];

        if (apiStates.length === 0) {
          setStates(DEFAULT_STATES);
          return;
        }

        // Sort by order if present, then clamp to max 3
        const sorted = [...apiStates].sort((a, b) => {
          const ao = typeof a.order === "number" ? a.order : 0;
          const bo = typeof b.order === "number" ? b.order : 0;
          return ao - bo;
        });

        const mapped: TimelineEditorState[] = sorted
          .slice(0, 3)
          .map((state, index) => ({
            key: state.key ?? `state-${index}`,
            label: state.label ?? "",
            titleLine1: state.titleLine1 ?? "",
            titleLine2: state.titleLine2 ?? undefined,
            desc: state.desc ?? "",
          }));

        setStates(mapped.length > 0 ? mapped : DEFAULT_STATES);
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

  const handleAddState = () => {
    if (states.length >= 3) {
      toast.error("You can have at most 3 timeline sections");
      return;
    }

    setStates((prev) => [
      ...prev,
      {
        key: `state-${Date.now()}`,
        label: "New section",
        titleLine1: "",
        titleLine2: "",
        desc: "",
      },
    ]);
  };

  const handleRemoveState = (index: number) => {
    if (states.length <= 1) {
      toast.error("At least one timeline section is required");
      return;
    }

    setStates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (states.length === 0 || states.length > 3) {
      toast.error("Timeline must have between 1 and 3 sections");
      return;
    }

    for (const state of states) {
      if (
        !state.key ||
        !state.label.trim() ||
        !state.titleLine1.trim() ||
        !state.desc.trim()
      ) {
        toast.error(
          "Each section needs a key, label, first title line, and description",
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        states: states.map((s, index) => ({
          key: s.key,
          label: s.label.trim(),
          titleLine1: s.titleLine1.trim(),
          titleLine2: s.titleLine2?.trim() || null,
          desc: s.desc.trim(),
          // Order is derived from the current position; admin does not edit it directly
          order: index + 1,
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
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-black/60">
                    Timeline stages
                  </h2>
                  <p className="mt-1 text-xs text-black/60">
                    Edit the label, heading and description for each stage. You
                    can have up to three sections; their order is based on the
                    list below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddState}
                  disabled={states.length >= 3}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-black hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add section
                </button>
              </div>

              <div className="space-y-4">
                {states.map((state, index) => (
                  <div
                    key={state.key ?? index}
                    className="rounded-xl border border-black/10 bg-black/2 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-black/40">
                        Item {index + 1} · {state.key || "unnamed"}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveState(index)}
                        disabled={states.length <= 1}
                        className="inline-flex items-center gap-1.5 text-[11px] text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>

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
                            Internal key
                          </label>
                          <input
                            type="text"
                            value={state.key}
                            onChange={(e) =>
                              handleChange(index, "key", e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs font-mono focus:border-black focus:outline-none"
                            placeholder="past"
                          />
                          <p className="mt-1 text-[10px] text-black/40">
                            Used as a stable identifier. Keep it lowercase and
                            unique.
                          </p>
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-black/40">
                          Step {index + 1} in scroll sequence
                        </p>
                      </div>

                      {/* Right side: heading + description */}
                      <div className="space-y-3 md:col-span-8">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
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
                              className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
                              placeholder="Early days"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium uppercase tracking-wider text-black/60">
                              Title line 2 (optional)
                            </label>
                            <input
                              type="text"
                              value={state.titleLine2 ?? ""}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "titleLine2",
                                  e.target.value,
                                )
                              }
                              className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none"
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

              <p className="mt-4 text-[11px] text-black/45">
                The order of sections above defines the scroll sequence around
                the spinner. You can reorder them by rearranging this list (drag
                &amp; drop can be added later).
              </p>
            </div>
          </section>

          {/* Preview */}
          <section className="lg:sticky lg:top-24 h-fit">
            <TimelinePreview states={states} />
          </section>
        </main>
      </div>
    </>
  );
}

function TimelinePreview({ states }: { states: TimelineEditorState[] }) {
  const previewStates = states.slice(0, 3);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 bg-black/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
        Landing Timeline – Live preview
      </div>
      <div className="space-y-8 bg-[#f8f5f2] px-6 pb-10 pt-8">
        {previewStates.map((state, index) => (
          <div key={state.key ?? index} className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2e2522]/70">
              {state.label || `Stage ${index + 1}`}
            </p>
            <div className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">
              {state.titleLine1 && (
                <p className="leading-tight">{state.titleLine1}</p>
              )}
              {state.titleLine2 && (
                <p className="leading-tight">{state.titleLine2}</p>
              )}
            </div>
            <p className="max-w-md text-sm leading-relaxed text-black/70 md:text-base">
              {state.desc ||
                "Description will appear here once you add content."}
            </p>
          </div>
        ))}
        {previewStates.length === 0 && (
          <p className="text-sm text-black/60">
            Add at least one timeline section to see the preview.
          </p>
        )}
      </div>
    </div>
  );
}
