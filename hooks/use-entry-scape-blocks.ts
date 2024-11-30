import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";

import { EnvSettings } from "@/env/env-settings";
import { createBlocksConfig } from "@/utilities/entryscape/blocks/config";

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
    | "mqa";
}

export const useEntryScapeBlocks = ({
  entrystoreBase,
  env,
  lang,
  curi,
  uri,
  iconSize,
  pageType,
  context,
  esId,
}: BlocksConfig) => {
  const { t } = useTranslation();

  useEffect(() => {
    //this is to make sure that the correct entryscape blocks are loaded when navigating to a new page
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a");

      if (link && link.href.startsWith(window.origin)) {
        event.preventDefault();
        window.location.href = link.href;
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // Create the ready promise if it doesn't exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).__entryscape_blocks_ready) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__entryscape_blocks_ready = new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__entryscape_blocks_resolve = resolve;
      });
    }

    const initializeBlocks = async () => {
      try {
        const newConfig = createBlocksConfig({
          entrystoreBase,
          env,
          lang,
          curi,
          uri,
          iconSize,
          t,
          pageType,
          context,
          esId,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__entryscape_config =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((window as any).__entryscape_config || []).concat(newConfig);

        if (pageType !== "mqa") {
          await loadScript(
            lang === "sv"
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL,
          );
        } else {
          await loadScript(
            lang === "sv"
              ? env.ENTRYSCAPE_MQA_SV_URL
              : env.ENTRYSCAPE_MQA_EN_URL,
          );
        }

        await loadScript(env.ENTRYSCAPE_BLOCKS_URL);

        // Wait for blocks to be ready
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).__entryscape_blocks_ready;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).__entryscape_blocks) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__entryscape_blocks.init();
        }
      } catch (error) {
        console.error("Error initializing EntryScape blocks:", error);
      }
    };

    initializeBlocks();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__entryscape_config = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).__entryscape_blocks?.clear) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__entryscape_blocks.clear();
      }
    };
  }, []);
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
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = reject;
    container.appendChild(script); // Append to container instead of body
  });
};
