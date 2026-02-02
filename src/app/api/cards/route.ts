// app/api/cards/route.ts
import { NextResponse } from "next/server";
import type { CardData } from "@/components/Card";

const cards: CardData[] = [
  {
    id: "hero-main",
    variant: "hero",
    title: "Your 360° partner in",
    titleSecondary: "electromobility",
    image: {
      src: "/images/relats/hero-braid.jpg",
      alt: "Orange braided cable representing electromobility solutions",
    },
  },
  {
    id: "media-busbar",
    variant: "media",
    eyebrow: "Overview",
    title: "High-performance busbar protection",
    subtitle: "Periflex busbar systems for next‑gen EV architectures.",
    image: {
      src: "/images/relats/busbar.jpg",
      alt: "Orange protected busbar assembly",
    },
  },
  {
    id: "list-industries",
    title: "Industries we serve",
    variant: "list",
    eyebrow: "Mobility industries",
    stackedLines: [
      "Construction machines",
      "Hybrid & electric",
      "Buses & trucks",
      "Railway",
      "Agriculture machines",
    ],
    listItems: [
      "Ovens",
      "Vitroceramics",
      "Industrial installations",
      "Heat",
      "Electricity",
      "Electromagnetic",
      "Robotics",
    ],
  },
  {
    id: "product-wsx45",
    variant: "product",
    eyebrow: "Revitex",
    title: "Revitex",
    titleSecondary: "WSX45",
    subtitle: "Operating temperature and thermal runaway performance.",
    image: {
      src: "/images/relats/wsx45-hero.jpg",
      alt: "Close-up of orange Revitex WSX45 sleeve",
    },
    stats: [
      {
        label: "Operating temperature",
        value: "-70°C to +210°C",
      },
      {
        label: "Thermal runaway",
        value: "+500°C × 5 mins ≥ 2kV",
      },
    ],
  },
  {
    id: "media-sustainability",
    variant: "media",
    eyebrow: "Coming soon",
    title: "Sustainability Commitment",
    subtitle: "A new certification for a higher standard of sustainability.",
    image: {
      src: "/images/relats/sustainability.jpg",
      alt: "Green mountains representing sustainability",
    },
  },
  {
    id: "thumb-row",
    variant: "compactThumb",
    title: "Periflex",
    titleSecondary: "DURA HA",
    eyebrow: "DURA HA",
    thumbnailCaption: "Mechanical & thermal protection",
    image: {
      src: "/images/relats/thumb-dura-ha.jpg",
      alt: "Periflex DURA HA sleeve sample",
    },
  },
];

export async function GET() {
  return NextResponse.json(cards);
}
