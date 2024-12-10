import { FC, MouseEvent } from "react";

import { ButtonLink } from "@/components/button";

export const skipToContent = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  let content = document.querySelector("#SearchHero");
  if (!content) content = document.querySelector("article");
  if (!content) content = document.querySelector("main");
  if (!content) return;

  const focusable = content.querySelectorAll<HTMLElement>(
    `button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])`,
  );

  const first = focusable[0];

  if (first) {
    startFromTop();
    first.focus();
  }
};

export const SkipToContent: FC<{ text: string }> = ({ text }) => {
  return (
    <ButtonLink
      href="#main"
      tabIndex={0}
      className={`focus--white focus--outline focus--in absolute left-none top-none z-50 w-[17.25rem] 
        -translate-x-full justify-center bg-brown-900 !py-[0.9375rem] text-brown-100 focus-visible:translate-x-none`}
      onClick={skipToContent}
      label={text}
    />
  );
};

/**
 * Skips to the desired element by setting focus to it
 * and scrolls it into view
 * @param id to the html-element
 * @param ev the clickEvent that occurs
 */
export const skipToElement = (id: string) => {
  const element = document.getElementById(id);

  if (!element) return;
  element.scrollIntoView();
};

/**
 * When using internal links, scroll position
 * might not be at the top, this function can then
 * be used to reset the scroll
 */
export const startFromTop = () => {
  if (typeof window !== "undefined") {
    // Temporarily disable smooth scrolling
    const html = document.querySelector("html");
    if (html instanceof HTMLElement) {
      html.style.scrollBehavior = "auto";
    }

    // Scroll to top
    window.scroll({
      top: 0,
      left: 0,
      behavior: "auto",
    });
    // Restore smooth scrolling
    if (html instanceof HTMLElement) {
      html.style.scrollBehavior = "smooth";
    }
  }
};
