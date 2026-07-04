"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { StickyNav } from "@/components/navigation/sticky-nav";
import type { Anchorlink } from "@/types/global";

/** Gets h2 headings in `#content` and builds anchor-link menu items. */
function getLinks(): Anchorlink[] {
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
}

/**
 * Client island for container pages. Builds the in-page anchor menu from `#content`
 * h2 headings and renders it as `StickyNav`.
 */
export function ContainerStickyNav() {
  const [menuItems, setMenuItems] = useState<Anchorlink[]>([]);
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
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
