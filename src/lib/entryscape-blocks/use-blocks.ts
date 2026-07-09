import { useRouter } from "next/navigation";
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

// Loads the base configs + blocks library exactly once for the whole SPA
// session. Subsequent page navigations reuse the same runtime and only re-feed
// the per-page config via addConfig().
let libPromise: Promise<void> | null = null;

// Guards the async init against navigations that happen mid-flight: each mount
// bumps the token, and stale async continuations bail out when it no longer
// matches.
let mountToken = 0;

// The blocks runtime is a singleton; only re-point it at a new EntryStore when
// the base URI actually changes.
let currentEntryStore: string | null = null;

const loadScript = (url: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const container = document.getElementById("scriptsPlaceholder");
    if (!container) {
      reject(new Error("scriptsPlaceholder element not found"));
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    // Keep async false so the scripts execute in the order they are appended;
    // the library expects its base configs to be present before it boots.
    script.async = false;
    script.onload = () => resolve();
    script.onerror = reject;
    container.appendChild(script);
  });

const ensureLib = (env: EnvSettings): Promise<void> => {
  if (libPromise) return libPromise;
  libPromise = (async () => {
    window.__entryscape_blocks_ready = new Promise<void>((resolve) => {
      window.__entryscape_blocks_resolve = resolve;
    });
    window.__entryscape_config = [{ block: "config", spa: true }];
    // Load both family base configs (opendata + MQA) once, before the engine.
    // They register the base blocks (e.g. catalogMQA) and RDForms bundles that
    // the pages rely on; addConfig()/setEntryStore()/init() come from the engine
    // itself (ENTRYSCAPE_BLOCKS_URL), so no extra bundle is needed.
    await loadScript("https://sandbox.admin.dataportal.se/tmp/blocks.js");
    await loadScript(env.ENTRYSCAPE_OPENDATA_URL);
    await loadScript(env.ENTRYSCAPE_MQA_URL);
    await loadScript(env.ENTRYSCAPE_BLOCKS_URL);
    await window.__entryscape_blocks_ready;
  })();
  return libPromise;
};

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
  const router = useRouter();

  // `t` and `env` change identity on most renders but should always be read
  // fresh inside the async init. Keep them in refs so they don't force the
  // effect to re-run, while the primitive deps below control actual re-init.
  const tRef = useRef(t);
  const envRef = useRef(env);
  tRef.current = t;
  envRef.current = env;

  // Bridge between the links rendered by Entryscape blocks and the Next.js
  // router. The link blocks call `window.__entryscape_blocks_click(href, event)`
  // on click; returning `true` means we took over navigation (SPA push),
  // `false` lets the browser handle it (new tab, modified click, external, or
  // in-page hash change).
  useEffect(() => {
    const handler = (href: string, event?: MouseEvent): boolean => {
      if (
        event &&
        (event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button === 1)
      ) {
        return false;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return false;
      }

      if (url.origin !== window.location.origin) return false;

      // Pure in-page hash change: let the browser scroll instead of pushing.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return false;
      }

      event?.preventDefault();
      router.push(`${url.pathname}${url.search}${url.hash}`);
      return true;
    };

    window.__entryscape_blocks_click = handler;
    return () => {
      if (window.__entryscape_blocks_click === handler) {
        delete window.__entryscape_blocks_click;
      }
    };
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = ++mountToken;

    (async () => {
      try {
        await ensureLib(envRef.current);
        if (token !== mountToken) return;

        const page = createBlocksConfig({
          entrystoreBase,
          env: envRef.current,
          lang,
          iconSize,
          t: tRef.current,
          pageType,
          context,
          esId,
        });

        queueMicrotask(async () => {
          if (token !== mountToken) return;
          window.__entryscape_blocks?.clear();
          if (entrystoreBase !== currentEntryStore) {
            window.__entryscape_blocks?.setEntryStore(entrystoreBase);
            currentEntryStore = entrystoreBase;
          }
          // Feed this page's config to the already-booted engine. init() alone
          // won't pick up new config, so addConfig() registers it (and overrides
          // custom blocks so the correct localization is applied) before init().
          await window.__entryscape_blocks?.addConfig(page);
          window.__entryscape_blocks?.init();
        });
      } catch (error) {
        console.error("Error initializing EntryScape blocks:", error);
      }
    })();
  }, [entrystoreBase, lang, pageType, context, esId, iconSize]);
};
