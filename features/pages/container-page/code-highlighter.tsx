"use client";

/* eslint-disable @typescript-eslint/no-require-imports */
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Environment } from "prismjs";
import { useEffect } from "react";

const highlightCodeBlock = async () => {
  (await require("prismjs")).hooks.add(
    "before-highlight",
    (env: Environment) => {
      env.code = (env.element as HTMLElement).innerText;
    },
  );
  (await require("prismjs")).highlightAll();
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

export function CodeHighlighter() {
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
    highlightCodeBlock().then(() => {
      const pres = Array.prototype.slice.call(
        document.getElementsByTagName("pre"),
      );
      pres.forEach((pre) => {
        pre.classList.add("line-numbers");
        pre.setAttribute("role", "region");
        pre.setAttribute("aria-label", t("common.code-block"));
      });

      setTimeout(() => {
        const codeWrappers = Array.prototype.slice.call(
          document.getElementsByClassName("code-toolbar"),
        );
        codeWrappers.map((codeWrapper) =>
          codeWrapper.setAttribute("lang", "en"),
        );

        const copyButtons = document.querySelectorAll(
          ".copy-to-clipboard-button",
        );
        copyButtons.forEach((button) => {
          const liveRegion = document.createElement("div");
          liveRegion.setAttribute("aria-live", "polite");
          liveRegion.className = "sr-only";
          button.parentElement?.appendChild(liveRegion);

          button.setAttribute("aria-label", t("common.copy-code"));

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
  }, [pathname]);

  return null;
}
