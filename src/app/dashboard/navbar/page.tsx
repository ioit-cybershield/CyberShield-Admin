// src/app/dashboard/navbar/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import {
  NavbarSitePreview,
  type PreviewNavItem,
} from "@/components/preview/Navbar";
import {
  ArrowLeft,
  Plus,
  Save,
  RefreshCw,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type NavItem = {
  id?: string;
  key: string;
  label: string;
  href?: string;
  order: number;
  isActive: boolean;
};

export default function NavbarEditorPage() {
  const router = useRouter();
  const [items, setItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  // Load items from API
  useEffect(() => {
    async function loadNavbar() {
      try {
        const res = await fetch("/api/navbar");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        toast.error("Failed to load navbar items");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNavbar();
  }, []);

  const handleChange = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleAdd = () => {
    const maxOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;
    setItems((prev) => [
      ...prev,
      {
        key: `item-${Date.now()}`,
        label: "New Item",
        href: "/",
        order: maxOrder + 1,
        isActive: true,
      },
    ]);
  };

  const handleDelete = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/navbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setItems(data.items);
      toast.success("Navbar saved successfully");
    } catch (error) {
      toast.error("Failed to save navbar");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRebuild = async () => {
    setIsRebuilding(true);
    try {
      const res = await fetch("/api/rebuild", { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger rebuild");
      toast.success("Site rebuild triggered successfully");
    } catch (error) {
      toast.error("Failed to trigger rebuild");
      console.error(error);
    } finally {
      setIsRebuilding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-black/60">Loading navbar...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-black/10">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-black">
                    Navbar Editor
                  </h1>
                  <p className="text-xs text-black/50 mt-0.5">
                    Manage navigation links and structure
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/20 hover:border-black/40 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleRebuild}
                  disabled={isRebuilding}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/20 hover:border-black/40 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRebuilding ? "animate-spin" : ""}`}
                  />
                  Rebuild Site
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,600px] gap-8">
            {/* Editor Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-black/10 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-black/60 mb-4">
                  Navigation Items
                </h2>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.key}
                      className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-black/10 hover:border-black/20 transition-colors bg-white"
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <GripVertical className="w-4 h-4 text-black/30" />
                        <span className="text-xs font-mono text-black/40 w-6">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            handleChange(index, { label: e.target.value })
                          }
                          placeholder="Label"
                          className="px-3 py-2 rounded-lg border border-black/20 focus:border-black focus:outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) =>
                            handleChange(index, { key: e.target.value })
                          }
                          placeholder="Key (unique)"
                          className="px-3 py-2 rounded-lg border border-black/20 focus:border-black focus:outline-none text-sm font-mono"
                        />
                        <input
                          type="text"
                          value={item.href || ""}
                          onChange={(e) =>
                            handleChange(index, { href: e.target.value })
                          }
                          placeholder="Path (e.g., /events)"
                          className="px-3 py-2 rounded-lg border border-black/20 focus:border-black focus:outline-none text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="number"
                          value={item.order}
                          onChange={(e) =>
                            handleChange(index, {
                              order: Number(e.target.value),
                            })
                          }
                          className="w-16 px-2 py-2 rounded-lg border border-black/20 focus:border-black focus:outline-none text-sm text-center"
                        />
                        <button
                          onClick={() =>
                            handleChange(index, { isActive: !item.isActive })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            item.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {item.isActive ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-black/40">No items yet</p>
                    <button
                      onClick={handleAdd}
                      className="mt-4 text-sm text-black/60 hover:text-black underline"
                    >
                      Add your first item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div
                className="bg-white rounded-2xl border border-black/10 overflow-hidden"
                style={{ height: "600px" }}
              >
                <NavbarSitePreview items={items} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
