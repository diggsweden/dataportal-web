"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { skipToElement } from "@/components/navigation/skip-to-content";

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) skipToElement(hash);
  }, [pathname]);

  return null;
}
