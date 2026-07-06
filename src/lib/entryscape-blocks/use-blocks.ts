import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import type { EnvSettings } from "@/env/env-settings";
import { createBlocksConfig } from "@/lib/entryscape-blocks/config";

interface BlocksConfig {
  entrystoreBase: string;
  context: string;
  esId: string;
  env: EnvSettings;
  lang: string;
  curi?: string;
  uri?: string;
  iconSize?: number;
  pageType:
    | "specification"
    | "dataset"
    | "concept"
    | "terminology"
    | "dataservice"
    | "apiexplore"
    | "organisation"
    | "mqa";
}

// Selector used to decide whether an anchor lives inside Entryscape-rendered
// content. Entryscape markup is tagged with either `data-entryscape="..."`,
// the `entryscape` class (set by some custom `run` blocks), or RDForms output.
const ENTRYSCAPE_CONTAINER_SELECTOR =
  "[data-entryscape], .entryscape, .rdforms";

export const useEntryScapeBlocks = ({
  entrystoreBase,
  env,
  lang,
  iconSize,
  pageType,
  context,
  esId,
}: BlocksConfig) => {
  const t = useTranslations();

  // `t` and `env` change identity on most renders but should always be read
  // fresh inside the async init. Keep them in refs so they don't force the
  // effect to re-run, while the primitive deps below control actual re-init.
  const tRef = useRef(t);
  const envRef = useRef(env);
  tRef.current = t;
  envRef.current = env;

  useEffect(() => {
    // Force a full page navigation for links *inside Entryscape output* so the
    // blocks bundle re-initializes cleanly on the next page. Scoped to
    // Entryscape containers so the rest of the app keeps Next.js client-side
    // routing. Modifier keys / non-primary clicks / target="_blank" are
    // respected so "open in new tab" still works.
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      if (!link.closest(ENTRYSCAPE_CONTAINER_SELECTOR)) return;

      if (link.target && link.target !== "_self") return;
      if (!link.href.startsWith(window.location.origin)) return;

      event.preventDefault();
      window.location.href = link.href;
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pageType, context, esId]);

  useEffect(() => {
    if (!window.__entryscape_blocks_ready) {
      window.__entryscape_blocks_ready = new Promise((resolve) => {
        window.__entryscape_blocks_resolve = resolve;
      });
    }

    // Guard async init against being resolved after the effect has been torn
    // down (deps changed mid-flight, or the component unmounted).
    let cancelled = false;

    const initializeBlocks = async () => {
      try {
        const newConfig = createBlocksConfig({
          entrystoreBase,
          env: envRef.current,
          lang,
          iconSize,
          t: tRef.current,
          pageType,
          context,
          esId,
        });

        window.__entryscape_config = (window.__entryscape_config || []).concat(
          newConfig,
        );

        // Create the ready promise
        window.__entryscape_blocks_ready = new Promise((resolve) => {
          window.__entryscape_blocks_resolve = resolve;
        });

        if (pageType !== "mqa") {
          await loadScript(
            lang === "sv"
              ? envRef.current.ENTRYSCAPE_OPENDATA_SV_URL
              : envRef.current.ENTRYSCAPE_OPENDATA_EN_URL,
          );
        } else {
          await loadScript(
            lang === "sv"
              ? envRef.current.ENTRYSCAPE_MQA_SV_URL
              : envRef.current.ENTRYSCAPE_MQA_EN_URL,
          );
        }

        await loadScript(envRef.current.ENTRYSCAPE_BLOCKS_URL);

        await window.__entryscape_blocks_ready;

        if (cancelled) return;

        if (window.__entryscape_blocks) {
          window.__entryscape_blocks.init();
        }
      } catch (error) {
        console.error("Error initializing EntryScape blocks:", error);
      }
    };

    initializeBlocks();

    return () => {
      cancelled = true;
      window.__entryscape_config = [];
      if (window.__entryscape_blocks?.clear) {
        window.__entryscape_blocks.clear();
      }
    };
  }, [entrystoreBase, lang, pageType, context, esId, iconSize]);
};

const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Get the scriptsPlaceholder element
    const container = document.getElementById("scriptsPlaceholder");
    if (!container) {
      reject(new Error("scriptsPlaceholder element not found"));
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = reject;
    container.appendChild(script); // Append to container instead of body
  });
};
