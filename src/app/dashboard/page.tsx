// pages/admin/dashboard.tsx
"use client";

import * as React from "react";
import { CardGrid, type CardLayoutItem } from "@/components/CardGrid";
import { CardSkeleton } from "@/components/CardSkeleton";
import { useCards } from "@/hooks/useCards";

export default function AdminDashboardPage() {
  const { cards, isLoading, error } = useCards();

  // Hard-coded layout for the visible screenshot cards.[file:2]
  const layout: CardLayoutItem[] | null = React.useMemo(() => {
    if (!cards) return null;

    const byId = Object.fromEntries(cards.map((c) => [c.id, c]));

    return [
      // Top-left hero card: spans 6 columns on xl, 3 on md, 2 rows tall.
      {
        card: byId["hero-main"],
        layoutClassName:
          "md:col-span-3 md:row-span-2 xl:col-span-5 xl:row-span-2",
      },
      // Center media busbar video/image card.
      {
        card: byId["media-busbar"],
        layoutClassName:
          "md:col-span-3 md:row-span-2 xl:col-span-4 xl:row-span-2",
      },
      // Right tall industries list card.
      {
        card: byId["list-industries"],
        layoutClassName:
          "md:col-span-6 md:row-span-2 xl:col-span-3 xl:row-span-2",
      },
      // Bottom-left Revitex WSX45 product card.
      {
        card: byId["product-wsx45"],
        layoutClassName:
          "md:col-span-3 md:row-span-2 xl:col-span-5 xl:row-span-2",
      },
      // Bottom-center sustainability commitment.
      {
        card: byId["media-sustainability"],
        layoutClassName:
          "md:col-span-3 md:row-span-2 xl:col-span-4 xl:row-span-2",
      },
      // Bottom-right thumbnail row (horizontal list).
      {
        card: byId["thumb-row"],
        layoutClassName:
          "md:col-span-6 md:row-span-1 xl:col-span-3 xl:row-span-1",
      },
    ].filter((item) => item.card);
  }, [cards]);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <h1 className="sr-only">Relats overview dashboard</h1>

      {error && (
        <p className="px-4 pt-6 text-sm text-red-400">
          Failed to load cards: {error.message}
        </p>
      )}

      {isLoading || !layout ? (
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5 xl:grid-cols-12 xl:gap-6">
            <div className="md:col-span-3 md:row-span-2 xl:col-span-5 xl:row-span-2">
              <CardSkeleton />
            </div>
            <div className="md:col-span-3 md:row-span-2 xl:col-span-4 xl:row-span-2">
              <CardSkeleton />
            </div>
            <div className="md:col-span-6 md:row-span-2 xl:col-span-3 xl:row-span-2">
              <CardSkeleton />
            </div>
            <div className="md:col-span-3 md:row-span-2 xl:col-span-5 xl:row-span-2">
              <CardSkeleton />
            </div>
            <div className="md:col-span-3 md:row-span-2 xl:col-span-4 xl:row-span-2">
              <CardSkeleton />
            </div>
            <div className="md:col-span-6 md:row-span-1 xl:col-span-3 xl:row-span-1">
              <CardSkeleton />
            </div>
          </div>
        </section>
      ) : (
        <CardGrid items={layout} />
      )}
    </main>
  );
}
