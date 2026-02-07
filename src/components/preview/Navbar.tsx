// src/app/dashboard/navbar/NavbarSitePreview.tsx
"use client";

import React from "react";

export type PreviewNavItem = {
  key: string;
  label: string;
  href?: string;
  isActive: boolean;
  order: number;
};

interface NavbarSitePreviewProps {
  items: PreviewNavItem[];
}

// --- Icons (Placeholders for your imports) ---
const LogoIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const LogoBlack = () => (
  <span className="font-bold text-xl tracking-tight text-black">SUNDAY</span>
);

export function NavbarSitePreview({ items }: NavbarSitePreviewProps) {
  // 1. Prepare Data
  const activeItems = items
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full h-[850px] bg-[#111111] flex flex-col rounded-xl overflow-hidden border border-neutral-800">
      {/* Preview Label */}
      <div className="px-4 py-2 bg-black/40 border-b border-white/10 shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
          Live Preview
        </span>
      </div>

      {/* Preview Viewport (Acts as the 'window') */}
      <div className="flex-1 relative w-full bg-neutral-100 flex items-center justify-center overflow-hidden">
        {/* Decorative Background (To show blur effect) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />

        {/* --- NAVBAR CONTAINER --- */}
        {/* We force the dimensions that GSAP would have animated to:
            Width: clamp(700px, 75vw, 1200px) -> Simplified to fixed for preview consistency
            Height: min(72vh, 600px) -> Fixed to 600px for preview
        */}
        <div
          className="relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-black/10 shadow-sm rounded-2xl"
          style={{
            width: "min(90%, 1000px)",
            height: "600px",
          }}
        >
          {/* Header (Logo + Close Button) */}
          {/* Note: h-15 is approx 60px (3.75rem) */}
          <div className="absolute top-0 left-0 w-full flex items-center justify-between px-1 h-[60px] z-20">
            {/* Logo Left */}
            <div className="flex items-center justify-center p-2 w-[60px] h-[60px]">
              <div className="w-8 h-8">
                <LogoIcon />
              </div>
            </div>

            {/* Logo Center */}
            <div className="transition-all duration-300 origin-center scale-100 opacity-100">
              <LogoBlack />
            </div>

            {/* Close Button (Forced to 'Open' X state) */}
            <div className="w-[60px] h-[60px] flex items-center justify-center cursor-pointer">
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className="absolute h-0.5 bg-black w-5 rotate-45 top-1/2 -translate-y-1/2" />
                <span className="absolute h-0.5 bg-black w-5 -rotate-45 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Content Container */}
          {/* Exact spacing from original: pt-20 (5rem/80px), px-6, pb-6 */}
          <div className="absolute inset-0 pt-20 px-6 pb-6 flex flex-col justify-between">
            {/* Main Grid: Nav Links + Video */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 h-full overflow-hidden">
              {/* Left: Nav Links */}
              <nav className="flex flex-col gap-2 shrink-0 overflow-y-auto">
                {activeItems.map((item) => (
                  <div
                    key={item.key}
                    // Exact classes from original
                    className="nav-link-item block text-3xl md:text-4xl text-black/90 hover:text-black transition-all duration-200 py-1 font-extrabold cursor-pointer"
                  >
                    {item.label}
                  </div>
                ))}
                {activeItems.length === 0 && (
                  <p className="text-neutral-400 italic">No items visible</p>
                )}
              </nav>

              {/* Right: Media Card */}
              <div className="flex flex-col nav-media-card h-full min-h-0">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-black group">
                  <video
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    autoPlay
                    muted
                    loop
                    playsInline
                    src="/assets/nav-element.mp4"
                  />
                  {/* Fallback overlay if video fails or missing */}
                  <div className="absolute inset-0 bg-neutral-900/10 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* Exact spacing: border-t, pt-6, mt-6 */}
            <div className="nav-footer flex items-end justify-between border-t border-black/10 pt-6 mt-6 shrink-0">
              <div className="hidden md:block text-sm text-neutral-500">
                A community for students.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
