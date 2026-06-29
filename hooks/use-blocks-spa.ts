import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";

import { EnvSettings } from "@/env/env-settings";
import { createBlocksConfig } from "@/utilities/entryscape/blocks/config";

type BaseKey = "opendata-sv" | "opendata-en" | "mqa-sv" | "mqa-en";

interface BlocksRuntime {
  init: (config?: unknown[]) => void;
  clear: () => void;
  setEntryStore: (entrystoreBase: string) => void;
}

declare global {
  interface Window {
    __entryscape_config?: unknown;
    __entryscape_blocks?: BlocksRuntime;
    __entryscape_blocks_ready?: Promise<void>;
    __entryscape_blocks_resolve?: () => void;
  }
}

export interface BlocksSpaProps {
  entrystoreBase: string;
  context: string;
  esId: string;
  env: EnvSettings;
  lang: string;
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

let libPromise: Promise<void> | null = null;
const baseCache = new Map<BaseKey, unknown[]>();
const baseLoads = new Map<BaseKey, Promise<unknown[]>>();
let mountToken = 0;
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
    await loadScript(env.ENTRYSCAPE_BLOCKS_URL);
    await window.__entryscape_blocks_ready;
  })();
  return libPromise;
};

const urlForKey = (env: EnvSettings, key: BaseKey): string => {
  switch (key) {
    case "opendata-sv":
      return env.ENTRYSCAPE_OPENDATA_SV_URL;
    case "opendata-en":
      return env.ENTRYSCAPE_OPENDATA_EN_URL;
    case "mqa-sv":
      return env.ENTRYSCAPE_MQA_SV_URL;
    case "mqa-en":
      return env.ENTRYSCAPE_MQA_EN_URL;
  }
};

const ensureBase = (env: EnvSettings, key: BaseKey): Promise<unknown[]> => {
  const cached = baseCache.get(key);
  if (cached) return Promise.resolve(cached);

  const inFlight = baseLoads.get(key);
  if (inFlight) return inFlight;

  const load = (async () => {
    const before = window.__entryscape_config;
    window.__entryscape_config = [];
    try {
      await loadScript(urlForKey(env, key));
      const raw = window.__entryscape_config;
      const captured = Array.isArray(raw) ? raw : raw ? [raw] : [];
      baseCache.set(key, captured);
      return captured;
    } finally {
      window.__entryscape_config = before;
      baseLoads.delete(key);
    }
  })();

  baseLoads.set(key, load);
  return load;
};

const baseKeyFor = (
  pageType: BlocksSpaProps["pageType"],
  lang: string,
): BaseKey => {
  const langPart = lang === "en" ? "en" : "sv";
  return pageType === "mqa" ? `mqa-${langPart}` : `opendata-${langPart}`;
};

export const useBlocksSpa = ({
  entrystoreBase,
  env,
  lang,
  iconSize,
  pageType,
  context,
  esId,
}: BlocksSpaProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = ++mountToken;

    (async () => {
      try {
        await ensureLib(env);
        const base = await ensureBase(env, baseKeyFor(pageType, lang));
        if (token !== mountToken) return;

        const page = createBlocksConfig({
          entrystoreBase,
          env,
          lang,
          iconSize,
          t,
          pageType,
          context,
          esId,
        });

        queueMicrotask(() => {
          if (token !== mountToken) return;
          window.__entryscape_blocks?.clear();
          if (entrystoreBase !== currentEntryStore) {
            window.__entryscape_blocks?.setEntryStore(entrystoreBase);
            currentEntryStore = entrystoreBase;
          }
          window.__entryscape_blocks?.init([...base, ...page]);
        });
      } catch (error) {
        console.error("Error initializing EntryScape blocks:", error);
      }
    })();
  }, [pageType, context, esId, lang, entrystoreBase]);
};
