// src/components/RebuildButton.tsx
"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface RebuildButtonProps {
  size?: "sm" | "md";
  label?: string;
}

export function RebuildButton({
  size = "md",
  label = "Rebuild Site",
}: RebuildButtonProps) {
  const [isRebuilding, setIsRebuilding] = useState(false);

  const handleRebuild = async () => {
    setIsRebuilding(true);
    try {
      const res = await fetch("/api/rebuild", { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger rebuild");
      toast.success("Site rebuild triggered successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to trigger rebuild");
    } finally {
      setIsRebuilding(false);
    }
  };

  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <button
      onClick={handleRebuild}
      disabled={isRebuilding}
      className={`flex items-center gap-2 rounded-lg border border-black/20 hover:border-black/40 transition-colors font-medium disabled:opacity-50 ${padding}`}
    >
      <RefreshCw className={`w-4 h-4 ${isRebuilding ? "animate-spin" : ""}`} />
      <span>{label}</span>
    </button>
  );
}
