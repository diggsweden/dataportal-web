"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { StickyNav } from "@/components/navigation/sticky-nav";
import type { Anchorlink } from "@/types/global";
import { highlightCode } from "@/utilities/highlight-code";

/**
 * Gets all h2 elements on the page and sets id:s to a visibility:hidden sibling be used
 * in the anchorLinkMenu
 * @returns {Array} An array of id:s to all h2-elements on the page
 */
const getLinks = () => {
  const menuItems: Anchorlink[] = [];
  const cont: HTMLElement =
    document.querySelector("#content") || document.createElement("div");

  const hTags = Array.prototype.slice.call(
    cont.querySelectorAll(".textBlock h2") || document.createElement("div"),
    0,
  );

  // Set only if there are more than 2 elements
  if (hTags.length > 2) {
    hTags.forEach((element: HTMLElement) => {
      // filter swedish characters and whitespaces from anchor
      const chars: Record<string, string> = {
        å: "a",
        ä: "a",
        ö: "o",
        " ": "_",
        ".": "",
      };
      const id = `${element.innerText
        .toLowerCase()
        .replace(/[åäö\s.]/g, (m: string) => chars[m] || "")
        .trim()}`;
      // Get the sibling element and give it the id
      element.id = `${id}`;
      menuItems.push({
        id: id,
        text: element.textContent,
      } as Anchorlink);
    });
  }

  return menuItems;
};

/**
 * Client island for the container page. Handles the browser-only work that
 * can't run on the server: code highlighting and the DOM-derived anchor-link
 * menu (`StickyNav`).
 */
export function ContainerPageClient() {
  const [menuItems, setMenuItems] = useState<Anchorlink[] | []>([]);
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
    //Highlights code using prismjs
    highlightCode(t);

    //Creates anchorlinks for the content menu
    const newMenuItems = getLinks();
    setMenuItems(newMenuItems);
  }, [pathname]);

  if (menuItems.length <= 2) return null;

  return (
    <div
      id="stickyNav"
      className="w-full overflow-y-auto lg:sticky lg:top-[4.75rem] lg:max-h-[calc(100vh-9.5rem)]"
    >
      <StickyNav
        menuHeading={t("common.content-menu-heading")}
        menuItems={menuItems}
      />
    </div>
  );
}
