/* eslint-disable @next/next/no-img-element */
"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Existing product slider data ---
interface SliderItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  specs: {
    label: string;
    value: string;
    subvalue?: string;
  }[];
  hasComboLabel?: boolean;
  hasSecondaryLabel?: boolean;
}

const sliderData: SliderItem[] = [
  {
    id: 1,
    title: "PLAS8 NA",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-1.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +150ºC" },
      {
        label: "Abrasion resistance",
        value: "ISO 6722-1",
        subvalue: "Class 4 (4.000 - 14.999 cycles)",
      },
    ],
    hasComboLabel: true,
  },
  {
    id: 2,
    title: "Revitex",
    subtitle: "VHG10 Purple",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-2.png",
    specs: [
      {
        label: "Operating temperature",
        value: "-70ºC to +225ºC",
        subvalue: "(Peaks at +300ºC)",
      },
      { label: "Impact protection", value: "LV 312-3 X < 25" },
    ],
  },
  {
    id: 3,
    title: "Periflex PS",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-3.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +150ºC" },
      { label: "Expansion Ratio", value: "1:2" },
      {
        label: "Abrasion resistance",
        value: "ISO 6722-1",
        subvalue: "Class 4 (4.000 - 14.999 cycles)",
      },
    ],
    hasComboLabel: true,
  },
  {
    id: 4,
    title: "Revitex",
    subtitle: "VSCTF RW",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-4.png",
    specs: [
      {
        label: "Operating temperature",
        value: "-70ºC to +235ºC",
        subvalue: "(Peaks at +300ºC)",
      },
      {
        label: "Fire behaviour",
        value: "EN 45545-2",
        subvalue: "R22 Hazard Level: H1, H2\nR23 Hazard Level: H3",
      },
    ],
    hasSecondaryLabel: true,
  },
  {
    id: 5,
    title: "Periflex",
    subtitle: "DURA HA",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-5.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +125ºC" },
      {
        label: "Mechanical protection",
        value: "ISO 6722-1 Class 7",
        subvalue: "(100.000 - 199.999 cycles)",
      },
    ],
  },
  {
    id: 6,
    title: "Periflex",
    subtitle: "EMI",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-6.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +150ºC" },
      { label: "Expansion Ratio", value: "1:2 approx (Depending on size)" },
      {
        label: "EMI shielding effectiveness",
        value: "Ø 40 mm",
        subvalue: "300 MHz → 74.8 dB\n600 MHz → 67.5 dB\n1 gHz → 63.5 dB",
      },
    ],
    hasSecondaryLabel: true,
  },
  {
    id: 7,
    title: "Revitex",
    subtitle: "WSX45",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-7.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +210ºC" },
      { label: "Thermal Runaway", value: "+500ºC x 5 mins ≥ 2kv" },
    ],
  },
  {
    id: 8,
    title: "Revitex",
    subtitle: "VSC25",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-8.png",
    specs: [
      {
        label: "Operating temperature",
        value: "-70°C to +235ºC",
        subvalue: "(Peaks +300ºC)",
      },
      { label: "Thermal Runaway", value: "+500ºC x 5 mins ≥ 1kV" },
    ],
  },
  {
    id: 9,
    title: "Revitex",
    subtitle: "VSCTF",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/slide-9.png",
    specs: [
      { label: "Operating temperature", value: "-70ºC to +210ºC" },
      {
        label: "Flammability",
        value: "FMVSS 302 Self-extiguishing\nUL94 V1 (Ø 18 mm)",
      },
    ],
  },
];

const industries = [
  {
    name: "Construction machines",
    video:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/construction.mp4",
    poster:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/construction.jpg",
  },
  {
    name: "Hybrid & electric",
    video:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/hybrid.mp4",
    poster:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/hybrid.jpg",
  },
  {
    name: "Buses & trucks",
    video:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/buses.mp4",
    poster:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/buses.jpg",
  },
  {
    name: "Railway",
    video:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/railway.mp4",
    poster:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/railway.jpg",
  },
  {
    name: "Agriculture machines",
    video:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/agriculture.mp4",
    poster:
      "https://toptier.relats.com/wp-content/themes/relats/videos/overview/agriculture.jpg",
  },
];

const carouselItems = [
  {
    name: "Periflex DURA HA",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/carousel-1.jpg",
  },
  {
    name: "PLAS8 NA",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/carousel-2.jpg",
  },
  {
    name: "Revitex VSCTF RW",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/carousel-3.jpg",
  },
  {
    name: "Revitex WSX45",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/carousel-4.jpg",
  },
  {
    name: "Periflex NSGD",
    image:
      "https://toptier.relats.com/wp-content/themes/relats/img/overview/carousel-5.jpg",
  },
];

const extraItems = [
  "Ovens",
  "Vitroceramics",
  "Industrial installations",
  "Heat",
  "Electricity",
  "Electromagnetic",
  "Robotics",
];

// --- New: Section definitions for the carousels ---

type SectionPage = {
  id: string;
  label: string;
  href: string;
  description: string;
};

const landingPages: SectionPage[] = [
  {
    id: "hero",
    label: "Hero",
    href: "/dashboard/landing/hero",
    description: "Manage the landing hero lines, bottom text, and CTAs.",
  },
  {
    id: "about",
    label: "About",
    href: "/dashboard/landing/about",
    description: "Edit the “Why CyberShield?” copy and feature items.",
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "/dashboard/landing/gallery",
    description: "Curate landing gallery cards and their metadata.",
  },
  {
    id: "cta",
    label: "CTA",
    href: "/dashboard/landing/cta",
    description: "Control the main call-to-action block and buttons.",
  },
  {
    id: "timeline",
    label: "Timeline",
    href: "/dashboard/landing/timeline",
    description: "Configure Past, Today, and Future timeline states.",
  },
];

const generalPages: SectionPage[] = [
  {
    id: "navbar",
    label: "Navbar",
    href: "/dashboard/general/navbar",
    description: "Site-wide navigation links and visibility.",
  },
  {
    id: "footer",
    label: "Footer",
    href: "/dashboard/general/footer",
    description: "Footer grid links, legal links, and social icons.",
  },
];

// --- New: inline carousel component used INSIDE existing cards ---

function SectionCarouselInline({
  badgeLabel,
  title,
  pages,
  align = "left",
}: {
  badgeLabel: string;
  title: string;
  pages: SectionPage[];
  align?: "left" | "center";
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const total = pages.length;
  const current = pages[index];

  const handleNavigate = () => {
    router.push(current.href);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % total);
  };

  return (
    <div
      className="flex w-full flex-col justify-between text-white cursor-pointer"
      onClick={handleNavigate}
    >
      <div
        className={`flex flex-col gap-1 ${
          align === "center" ? "items-center text-center" : ""
        }`}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-medium">
          {badgeLabel}
        </span>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">
          <span className="text-white/90">{current.label}</span>
          <span className="text-white/60">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-[11px] leading-relaxed text-white/80 max-w-xs">
          {current.description}
        </p>

        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-medium">
            <span>Open {current.label} editor</span>
            <ArrowRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
              aria-label="Previous section"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
              aria-label="Next section"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pages.map((page, i) => (
          <span
            key={page.id}
            className={[
              "rounded-full border px-2 py-0.5 text-[9px]",
              i === index
                ? "bg-white text-black border-white"
                : "border-white/25 text-white/75",
            ].join(" ")}
          >
            {page.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Main dashboard page ---

export default function OverviewComponent() {
  const [currentSlide, setCurrentSlide] = useState(6);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);

  useEffect(() => {
    setCurrentSlide(6);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length,
    );
  };

  const currentItem = sliderData[currentSlide];

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* Navbar placeholder remains as-is, currently omitted in code */}

      {/* Main Content - fills remaining viewport height */}
      <section className="flex-1 p-3 min-h-0">
        {/* Column 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full max-w-450 mx-auto">
          <div className="flex flex-col gap-3 min-h-0">
            {/* HERO CARD: now Landing components carousel, same layout */}
            <div className="relative rounded-2xl overflow-hidden flex-[0.6] min-h-0 group">
              <div className="absolute inset-0">
                <img
                  src="https://toptier.relats.com/wp-content/themes/relats/img/overview/text.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-black/50 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 flex h-full items-center p-5">
                <SectionCarouselInline
                  badgeLabel="Landing page"
                  title="Landing components"
                  pages={landingPages}
                  align="left"
                />
              </div>
            </div>

            {/* Product Slider Box - unchanged */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e8e3dc] flex-[1.4] min-h-0">
              {/* Navigation Arrows */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-black" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>

              {/* Slider Content */}
              <div className="relative h-full flex flex-col">
                {/* Product Image */}
                <div className="relative h-[40%] overflow-hidden">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 p-5 flex flex-col justify-between overflow-auto">
                  <div>
                    <h3 className="text-black text-3xl xl:text-4xl font-medium leading-none mb-4 tracking-tight">
                      {currentItem.title}
                      {currentItem.subtitle && (
                        <span className="block">{currentItem.subtitle}</span>
                      )}
                    </h3>

                    <div className="space-y-3">
                      {currentItem.specs.map((spec, idx) => (
                        <div key={idx}>
                          <div className="text-[#666] text-[9px] uppercase tracking-wider mb-0.5 font-medium">
                            {spec.label}
                          </div>
                          {currentItem.hasComboLabel && idx === 1 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium">
                                {spec.value}
                              </span>
                              <span className="text-black text-xs">
                                {spec.subvalue}
                              </span>
                            </div>
                          ) : currentItem.hasSecondaryLabel && idx === 2 ? (
                            <div>
                              <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium inline-block mb-1">
                                {spec.value}
                              </span>
                              {spec.subvalue?.split("\n").map((line, i) => (
                                <div
                                  key={i}
                                  className="text-black text-xs leading-relaxed"
                                >
                                  {line}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-black text-base font-medium leading-tight">
                              {spec.value}
                              {spec.subvalue && (
                                <span className="block text-sm mt-0.5">
                                  {spec.subvalue}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 text-black text-xs font-medium mt-4 group/link hover:opacity-70 transition-opacity self-start">
                    Know more
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex pt-20 flex-col gap-3 min-h-0">
            <div className="text-white items-center justify-center text-center ">
              This will be the navbar of the page.
            </div>
            {/* Video Box - unchanged */}
            <div className="relative rounded-2xl overflow-hidden flex-[1.3] min-h-0 bg-black">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="https://toptier.relats.com/wp-content/themes/relats/img/posters/busbar.png"
              >
                <source
                  src="https://toptier.relats.com/wp-content/themes/relats/videos/overview/preview.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-linear-to-t from-orange-500/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* SUSTAINABILITY CARD: now General components carousel */}
            <div className="relative rounded-2xl overflow-hidden flex-[0.7] min-h-0 group">
              <img
                src="https://toptier.relats.com/wp-content/themes/relats/img/overview/sustainability.jpg"
                alt="General components"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <SectionCarouselInline
                  badgeLabel="General"
                  title="General components"
                  pages={generalPages}
                  align="center"
                />
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Industries Box - unchanged */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e8e3dc] p-5 flex-[1.3] min-h-0 flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-white px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold text-black border border-black/10">
                  Mobility industries
                </span>
              </div>

              <ul className="space-y-0 flex-1">
                {industries.map((industry, idx) => (
                  <li
                    key={idx}
                    className="relative py-2 border-b border-black/10 last:border-0 cursor-pointer group"
                    onMouseEnter={() => setHoveredIndustry(idx)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-black text-lg xl:text-xl font-medium tracking-tight group-hover:translate-x-2 transition-transform">
                        {industry.name}
                      </span>
                    </div>
                    {hoveredIndustry === idx && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-14 rounded-lg overflow-hidden shadow-xl z-10 pointer-events-none">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster={industry.poster}
                        >
                          <source src={industry.video} type="video/mp4" />
                        </video>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Extra Items */}
              <div className="mt-auto pt-4 border-t border-black/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#666] text-[9px] uppercase tracking-wider font-medium">
                    And more
                  </span>
                </div>
                <div className="flex gap-2 overflow-hidden">
                  {extraItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="whitespace-nowrap text-black/60 text-[10px]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Carousel Box - unchanged */}
            <a
              href="https://rv12bnjbgic.typeform.com/to/qxr7VLLd"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-2xl overflow-hidden bg-white p-5 hover:shadow-xl transition-shadow group block flex-[0.7] min-h-0 flex flex-col"
            >
              <div className="flex gap-2 mb-4 overflow-hidden flex-1">
                {carouselItems.map((product, idx) => (
                  <div key={idx} className="shrink-0 w-16 text-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mb-1.5 bg-[#f5f5f5]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[9px] text-black/70 leading-tight line-clamp-2">
                      {product.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-auto">
                <button className="px-5 py-2 rounded-full border border-black/20 text-xs font-medium text-black hover:bg-black hover:text-white transition-all">
                  Contact
                </button>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
