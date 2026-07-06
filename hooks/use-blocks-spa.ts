import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";

import { EnvSettings } from "@/env/env-settings";
import { createBlocksConfig } from "@/utilities/entryscape/blocks/config";

interface BlocksRuntime {
  init: (config?: unknown[]) => void;
  clear: () => void;
  setEntryStore: (entrystoreBase: string) => void;
  addConfig: (config: unknown[]) => Promise<void>;
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
    await loadScript('https://sandbox.admin.dataportal.se/tmp/blocks.js');
    await loadScript(env.ENTRYSCAPE_OPENDATA_URL);
    await loadScript(env.ENTRYSCAPE_MQA_URL);
    await loadScript(env.ENTRYSCAPE_BLOCKS_URL);
    await window.__entryscape_blocks_ready;
  })();
  return libPromise;
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

        queueMicrotask(async () => {
          if (token !== mountToken) return;
          window.__entryscape_blocks?.clear();
          if (entrystoreBase !== currentEntryStore) {
            window.__entryscape_blocks?.setEntryStore(entrystoreBase);
            currentEntryStore = entrystoreBase;
          }
          // We add the config as it overwrites custom blocks,
          // This way we will get the correct localization.
          await window.__entryscape_blocks?.addConfig(page);
          window.__entryscape_blocks?.init();
        });
      } catch (error) {
        console.error("Error initializing EntryScape blocks:", error);
      }
    })();
  }, [pageType, context, esId, lang, entrystoreBase]);
};
