// components/CardSkeleton.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "h-full rounded-[28px] bg-[#191919] shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
        "animate-pulse",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="h-6 w-32 rounded-full bg-[#252525]" />
        <div className="h-9 w-3/4 rounded-full bg-[#252525]" />
        <div className="mt-auto grid grid-cols-2 gap-3">
          <div className="h-4 rounded-md bg-[#252525]" />
          <div className="h-4 rounded-md bg-[#252525]" />
        </div>
      </div>
    </div>
  );
}
