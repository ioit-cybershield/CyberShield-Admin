// src/static/navbarDefaults.ts
import type { NavbarItemInput } from "@/schemas/navbar";

export function getDefaultNavbarItems(): NavbarItemInput[] {
  return [
    {
      key: "events",
      label: "Events",
      href: "/events",
      order: 1,
      isActive: true,
    },
    {
      key: "gallery",
      label: "Gallery",
      href: "/gallery",
      order: 2,
      isActive: true,
    },
    {
      key: "team",
      label: "Team",
      href: "/team",
      order: 3,
      isActive: true,
    },
    {
      key: "about",
      label: "About Us",
      href: "/about",
      order: 4,
      isActive: true,
    },
  ];
}
