"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { StickyNav } from "@/components/navigation/sticky-nav";
import type { Anchorlink } from "@/types/global";

const getLinks = () => {
  const menuItems: Anchorlink[] = [];
  const cont: HTMLElement =
    document.querySelector("#content") || document.createElement("div");

  const hTags = Array.prototype.slice.call(
    cont.querySelectorAll(".textBlock h2") || document.createElement("div"),
    0,
  );

  if (hTags.length > 2) {
    hTags.forEach((element: HTMLElement) => {
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
      element.id = `${id}`;
      menuItems.push({
        id: id,
        text: element.textContent,
      } as Anchorlink);
    });
  }

  return menuItems;
};

export function AnchorNavigation({ menuHeading }: { menuHeading: string }) {
  const [menuItems, setMenuItems] = useState<Anchorlink[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setMenuItems(getLinks());
  }, [pathname]);

  if (menuItems.length <= 2) return null;

  return (
    <div
      id="stickyNav"
      className="w-full overflow-y-auto lg:sticky lg:top-[4.75rem] lg:max-h-[calc(100vh-9.5rem)]"
    >
      <StickyNav menuHeading={menuHeading} menuItems={menuItems} />
    </div>
  );
}
