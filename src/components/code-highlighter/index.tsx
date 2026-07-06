"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { highlightCode } from "@/utilities/highlight-code";

/**
 * Client island that runs prismjs highlighting on code blocks emitted by
 * Server Components. Renders nothing and only runs the DOM side effect, so the
 * surrounding article can stay a Server Component. Re-runs on navigation so
 * highlighting is applied to the newly rendered content.
 */
export function CodeHighlighter() {
  const t = useTranslations();
  const pathname = usePathname();

  useEffect(() => {
    highlightCode(t);
  }, [pathname]);

  return null;
}
