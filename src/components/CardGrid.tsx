// components/CardGrid.tsx
"use client";

import * as React from "react";
import { Card, type CardData } from "./Card";
import { cn } from "@/lib/utils";

export interface CardLayoutItem {
  card: CardData;
  // Tailwind utility classes purely for layout: col-span/row-span, responsive variants.
  layoutClassName: string;
  interactive?: boolean;
}

export interface CardGridProps {
  items: CardLayoutItem[];
  className?: string;
}

export function CardGrid({ items, className }: CardGridProps) {
  return (
    <section
      aria-label="Relats overview bento"
      className={cn(
        "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6 lg:px-8", // max width ≈ 1152px.[file:2]
        className,
      )}
    >
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-6
          md:gap-5
          xl:grid-cols-12
          xl:gap-6
        "
        role="grid"
      >
        {items.map((item) => (
          <div
            key={item.card.id}
            role="row"
            className={cn("contents")} // let children use their spans.
          >
            <div
              role="gridcell"
              className={cn("min-h-[160px]", item.layoutClassName)}
            >
              <Card {...item.card} interactive={item.interactive} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
