/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCards.ts
"use client";

import * as React from "react";
import type { CardData } from "@/components/Card";

interface UseCardsResult {
  cards: CardData[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCards(endpoint: string = "/api/cards"): UseCardsResult {
  const [cards, setCards] = React.useState<CardData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch(endpoint, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Request failed with ${res.status}`);
        }

        const json = (await res.json()) as CardData[];
        setCards(json);
        setError(null);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [endpoint]);

  return { cards, isLoading, error };
}
