// src/app/landing/gallery/page.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type GalleryItem = {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  buttonLabel?: string;
  buttonHref?: string;
  imageBlobPath: string;
  imageUrl?: string; // from API, optional
  imageAlt: string;
  slot?: number | null;
  isVisible: boolean;
  // For admin-only preview:
  previewUrl?: string;
};

const MAX_SLOTS = 3;

export default function LandingGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/landing/gallery", { method: "GET" });
      const json = await res.json();
      const loaded: GalleryItem[] = (json.items ?? []).map(
        (item: GalleryItem) => ({
          ...item,
          tags: item.tags ?? [],
          previewUrl: undefined,
        }),
      );
      setItems(loaded);
    }
    load();
  }, []);

  const updateItem = (index: number, patch: Partial<GalleryItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleTagChange = (index: number, value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateItem(index, { tags });
  };

  const handleFileChange = async (index: number, file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      // TODO: toast error
      return;
    }

    const data = await res.json();
    console.log("Upload response:", data);
    updateItem(index, {
      imageBlobPath: data.pathname,
      previewUrl: data.url,
      imageUrl: data.url, // Optionally update the main imageUrl immediately for preview; or keep it unchanged and rely on the admin to save to update the live URL.
    });
  };

  const handleSlotChange = (index: number, slot: number | null) => {
    // Enforce single item per slot client-side too
    setItems((prev) => {
      const next = prev.map((it, idx) =>
        idx === index
          ? { ...it, slot }
          : it.slot === slot && slot != null
            ? { ...it, slot: null }
            : it,
      );
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        items: items.map(({ previewUrl, ...rest }) => rest),
      };
      const res = await fetch("/api/landing/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload);
      if (!res.ok) {
        // TODO: toast error
      } else {
        // Optionally re-sync from server
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Build preview items: only visible items with a slot, ordered by slot
  const previewItems: GalleryPreviewItem[] = items
    .filter((item) => item.isVisible && item.slot != null)
    .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0))
    .slice(0, MAX_SLOTS)
    .map((item, index) => ({
      id: item.id ?? String(index),
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      tags: item.tags ?? [],
      buttonLabel: item.buttonLabel,
      buttonHref: item.buttonHref,
      imageUrl: item.previewUrl ?? item.imageUrl ?? "",
    }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Landing Gallery
          </h1>
          <p className="text-sm text-zinc-500">
            Manage up to three highlighted gallery items on the landing page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </header>

      <div className="space-y-8">
        {items.map((item, index) => (
          <section
            key={item.id ?? index}
            className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6"
          >
            {/* Basic fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Title
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(index, { title: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Subtitle (optional)
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.subtitle ?? ""}
                    onChange={(e) =>
                      updateItem(index, { subtitle: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Description
                  <textarea
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    rows={4}
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, { description: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Tags (comma‑separated, optional)
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.tags.join(", ")}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                </label>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Button label (optional)
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.buttonLabel ?? ""}
                    onChange={(e) =>
                      updateItem(index, { buttonLabel: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Button URL (optional)
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.buttonHref ?? ""}
                    onChange={(e) =>
                      updateItem(index, { buttonHref: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Image alt text
                  <input
                    className="mt-1 w-full border border-zinc-300 px-3 py-2 text-sm"
                    value={item.imageAlt}
                    onChange={(e) =>
                      updateItem(index, { imageAlt: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm font-medium">
                  Replace image
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-sm"
                    onChange={(e) =>
                      handleFileChange(
                        index,
                        e.target.files ? e.target.files[0] : null,
                      )
                    }
                  />
                </label>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.isVisible}
                      onChange={(e) =>
                        updateItem(index, { isVisible: e.target.checked })
                      }
                    />
                    Visible on site
                  </label>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xs uppercase text-zinc-500">
                      Landing slot
                    </span>
                    <select
                      className="border border-zinc-300 px-2 py-1 text-sm"
                      value={item.slot ?? ""}
                      onChange={(e) =>
                        handleSlotChange(
                          index,
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    >
                      <option value="">None</option>
                      {Array.from({ length: MAX_SLOTS }, (_, i) => i + 1).map(
                        (slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Unified preview for landing gallery (up to 3 slotted items) */}
      <LandingGalleryPreview items={previewItems} />
    </main>
  );
}

export type GalleryPreviewItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  buttonLabel?: string;
  buttonHref?: string;
  imageUrl: string; // Blob URL or static preview URL
};

interface LandingGalleryPreviewProps {
  items: GalleryPreviewItem[];
}

export function LandingGalleryPreview({ items }: LandingGalleryPreviewProps) {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const total = items.length;

  const clampIndex = useCallback(
    (value: number) => {
      if (!total) return 0;
      if (value < 0) return 0;
      if (value > total - 1) return total - 1;
      return value;
    },
    [total],
  );

  const goPrev = useCallback(() => {
    setIndex((prev) => clampIndex(prev - 1));
  }, [clampIndex]);

  const goNext = useCallback(() => {
    setIndex((prev) => clampIndex(prev + 1));
  }, [clampIndex]);

  // Keyboard support: left/right arrows when region is focused
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  if (!items.length) {
    return (
      <section
        aria-label="Landing gallery preview"
        className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-4 py-6 text-sm text-zinc-500"
      >
        No gallery items yet. Add items to see a live preview of the landing
        gallery.
      </section>
    );
  }

  return (
    <section
      aria-label="Landing gallery preview"
      className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 md:p-6"
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            Landing gallery preview
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            This preview matches how cards appear on the public site. Use the
            arrows or keyboard to move between items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            {index + 1} / {total}
          </span>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Previous gallery item"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={index === total - 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Next gallery item"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Slider region */}
      <div
        ref={sliderRef}
        tabIndex={0}
        className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="flex min-w-full flex-col gap-4 bg-white md:flex-row"
            >
              {/* Image: mirror live site (9:16 desktop, 16:9 mobile) */}
              <div className="relative h-56 w-full overflow-hidden bg-zinc-100 md:h-auto md:w-1/2">
                <div className="h-full w-full md:aspect-[9/16]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex w-full flex-col gap-3 px-4 py-5 md:w-1/2 md:px-6 md:py-6">
                <header>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Gallery card
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-zinc-900">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.subtitle}
                    </p>
                  )}
                </header>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>

                {item.buttonLabel && item.buttonHref && (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-700"
                      aria-label={`Primary button: ${item.buttonLabel}`}
                    >
                      <span>{item.buttonLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dots for additional context */}
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 w-4 rounded-full ${
                i === index ? "bg-zinc-900" : "bg-zinc-300"
              }`}
              aria-label={`Go to gallery item ${i + 1}`}
              aria-current={i === index ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </section>
  );
}
