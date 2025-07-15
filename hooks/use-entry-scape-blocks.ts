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
    | "organisation"
    | "mqa";
}

export const useEntryScapeBlocks = ({
  entrystoreBase,
  env,
  lang,
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
  }, [pageType, context, esId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeBlocks = async () => {
      try {
        const newConfig = createBlocksConfig({
          entrystoreBase,
          env,
          lang,
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

        // Create the ready promise
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__entryscape_blocks_ready = new Promise((resolve) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__entryscape_blocks_resolve = resolve;
        });

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
  }, [pageType, context, esId]);
};
