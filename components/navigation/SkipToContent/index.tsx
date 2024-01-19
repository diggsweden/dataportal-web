import { Button } from "@/components/global/Button";

import { FC } from "react";

export const skipToContent = () => {
  let content = document.querySelector("#Hero");
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
    <Button
      tabIndex={1}
      className={`focus--white focus--outline focus--in absolute left-none top-none z-50 w-[276px] 
        -translate-x-full justify-center bg-brown-900 !py-[15px] text-brown-100 focus-visible:translate-x-none`}
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
export const skipToElement = (id: string, ev?: React.MouseEvent) => {
  if (ev) {
    ev.preventDefault();
  }
  id = id.replace("#", "");
  const element = document.getElementById(id);
  if (!element) return;

  if (element.title === "anchorTarget") {
    const sibling = document.getElementById(`${id}-value`);
    if (sibling) {
      sibling.tabIndex = -1;
      sibling.focus();
      element.scrollIntoView();
    }
    return;
  }

  if (element.nodeName === "H1") {
    element.tabIndex = -1;
  }

  element.focus();
  element.scrollIntoView();
};

/**
 * When using internal links, scroll position
 * might not be at the top, this function can then
 * be used to reset the scroll
 */
export const startFromTop = () => {
  if (typeof window !== "undefined") {
    // Dirty solution to prevent smooth scrolling
    const html = document.querySelector("html");
    html && (html.style.scrollBehavior = "auto");

    // Scroll to top
    window.scroll({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    // Todo: find a better solution for handling scrollbehaviour
    html && (html.style.scrollBehavior = "smooth");
  }
};
