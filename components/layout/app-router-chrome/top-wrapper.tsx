"use client";

import type { ReactNode } from "react";

import { useLayoutState } from "@/providers/layout-state-provider";

export function TopWrapper({ children }: { children: ReactNode }) {
  const { openSideBar } = useLayoutState();

  return (
    <div
      id="top"
      className={`relative h-[100dvh] md:h-full ${
        openSideBar ? "overflow-y-hidden md:overflow-y-auto" : ""
      }`}
    >
      {children}
    </div>
  );
}
