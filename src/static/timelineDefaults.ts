// src/static/timelineDefaults.ts
import type { TimelineStateInput } from "@/schemas/timeline";

export function getDefaultTimelineStates(): TimelineStateInput[] {
  return [
    {
      key: "past",
      label: "Past",
      titleLine1: "Early days",
      titleLine2: "of CyberShield",
      desc: "How the club started, first meetups, and initial workshops.",
    },
    {
      key: "today",
      label: "Today",
      titleLine1: "Active community",
      titleLine2: "learning by doing",
      desc: "Regular workshops, CTFs, awareness sessions and internal projects.",
    },
    {
      key: "future",
      label: "Future",
      titleLine1: "Scaling impact",
      titleLine2: "across the campus",
      desc: "Collaborations, intercollege events, research and advanced tracks.",
    },
  ];
}
