// src/app/dashboard/navbar/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { NavbarPreview } from "./NavbarPreview";

type NavItem = {
  id?: string;
  key: string;
  label: string;
  href?: string;
  order: number;
  isActive: boolean;
};

export default function NavbarEditorPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/navbar");
      const data = await res.json();
      setItems(data.items);
    })();
  }, []);

  const handleChange = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleRebuild = async () => {
    const res = await fetch("/api/rebuild", { method: "POST" });
    if (res.ok) toast.success("Rebuild triggered");
    else toast.error("Failed to trigger rebuild");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/navbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Navbar saved");
    } catch (err) {
      toast.error("Could not save navbar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        key: `item-${prev.length + 1}`,
        label: "New Item",
        href: "/",
        order: prev.length,
        isActive: true,
      },
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Navbar</h1>
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm"
          >
            Add item
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Editor */}
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          {items.map((item, index) => (
            <div
              key={item.key}
              className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-3 sm:flex-row sm:items-center"
            >
              <input
                className="h-9 flex-1 rounded-md border border-zinc-300 px-2 text-sm"
                value={item.label}
                onChange={(e) => handleChange(index, { label: e.target.value })}
                placeholder="Label"
              />
              <input
                className="h-9 flex-1 rounded-md border border-zinc-300 px-2 text-sm"
                value={item.href ?? ""}
                onChange={(e) =>
                  handleChange(index, { href: e.target.value || undefined })
                }
                placeholder="/events"
              />
              <input
                type="number"
                className="h-9 w-16 rounded-md border border-zinc-300 px-2 text-sm"
                value={item.order}
                onChange={(e) =>
                  handleChange(index, { order: Number(e.target.value) })
                }
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) =>
                    handleChange(index, { isActive: e.target.checked })
                  }
                />
                Active
              </label>
            </div>
          ))}
        </div>

        {/* Preview pane */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-medium text-zinc-500">Live preview</p>
          <NavbarPreview items={items.filter((i) => i.isActive)} />
        </div>
      </div>
    </div>
  );
}
