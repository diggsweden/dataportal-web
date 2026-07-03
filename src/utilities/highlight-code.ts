/* eslint-disable @typescript-eslint/no-require-imports */
import type { Environment } from "prismjs";

import type { Translate } from "@/i18n/types";

/**
 * Uses prismjs to style codeblock
 */
export const highlightCodeBlock = async () => {
  // ? Fix to get <br/> as line-breaks
  (await require("prismjs")).hooks.add(
    "before-highlight",
    (env: Environment) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      env.code = (env.element as HTMLElement).innerText;
    },
  );
  // * init prismjs
  (await require("prismjs")).highlightAll();
  // ? Await all plugins and components to fix hydration issue
  await require("prismjs/plugins/line-numbers/prism-line-numbers");
  await require("prismjs/components/prism-markup-templating");
  await require("prismjs/components/prism-csharp");
  await require("prismjs/components/prism-json");
  await require("prismjs/components/prism-javascript");
  await require("prismjs/components/prism-css");
  await require("prismjs/components/prism-php");
  await require("prismjs/components/prism-ruby");
  await require("prismjs/components/prism-python");
  await require("prismjs/components/prism-java");
  await require("prismjs/components/prism-c");
  await require("prismjs/components/prism-cpp");
  await require("prismjs/plugins/line-numbers/prism-line-numbers");
  await require("prismjs/plugins/toolbar/prism-toolbar");
  await require("prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard");
};

export const highlightCode = (t: Translate) => {
  highlightCodeBlock().then(() => {
    // Adds line numbers to codeBlocks
    const pres = Array.prototype.slice.call(
      document.getElementsByTagName("pre"),
    );
    pres.forEach((pre) => {
      pre.classList.add("line-numbers");
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", t("common.code-block"));
    });

    // Set timeout to allow for prismjs to load before adding new code
    setTimeout(() => {
      // Adds lang attribute to codeBlocks
      const codeWrappers = Array.prototype.slice.call(
        document.getElementsByClassName("code-toolbar"),
      );
      codeWrappers.map((codeWrapper) => codeWrapper.setAttribute("lang", "en"));

      // Add new code to set aria-labels
      const copyButtons = document.querySelectorAll(
        ".copy-to-clipboard-button",
      );
      copyButtons.forEach((button) => {
        // Create a live region for announcements
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.className = "sr-only";
        button.parentElement?.appendChild(liveRegion);

        // Set initial aria-label
        button.setAttribute("aria-label", t("common.copy-code"));

        // Add mutation observer to watch for data-copy-state changes
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === "data-copy-state") {
              const state = (mutation.target as HTMLElement).getAttribute(
                "data-copy-state",
              );
              let ariaLabel = t("common.copy-code");

              switch (state) {
                case "copy-success":
                  ariaLabel = t("common.code-copied-successfully");
                  break;
                case "copy-error":
                  ariaLabel = t("common.code-copy-failed");
                  break;
              }

              (mutation.target as HTMLElement).setAttribute(
                "aria-label",
                ariaLabel,
              );

              // Clear and update live region to trigger announcement
              liveRegion.textContent = "";
              setTimeout(() => {
                liveRegion.textContent = ariaLabel;
              }, 100);
            }
          });
        });

        observer.observe(button, { attributes: true });
      });
    }, 100);
  });
};
