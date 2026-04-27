"use client";

import type { ReactNode } from "react";

import { useLayoutState } from "@/providers/layout-state-provider";

export function FooterSidebarWrapper({ children }: { children: ReactNode }) {
  const { openSideBar } = useLayoutState();

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        openSideBar ? "xl:w-[calc(100vw-18.75rem)]" : "w-full"
      }`}
    >
      {children}
    </div>
  );
}
