"use client";

import { usePathname } from "next/navigation";
import { type FC, type MouseEvent, useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/link";

import { Heading } from "@/components/typography/heading";
import { useActiveHeading } from "@/hooks/use-active-heading";
import type { AnchorLink } from "@/types/global";

interface StickyNavProps {
  menuItems: AnchorLink[];
  menuHeading: string;
}

export const StickyNav: FC<StickyNavProps> = ({ menuItems, menuHeading }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const isScrolling = useRef(false);
  const pathname = usePathname() ?? "";

  const [activeItemId, setActiveItemId] = useActiveHeading(
    menuItems.map((item) => item.id),
    { enabled: isLargeScreen, paused: isScrolling },
  );

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hash && menuItems.some((item) => item.id === hash)) {
      setActiveItemId(hash);

      // Only scroll on initial load if there's a hash in the URL
      if (window.location.hash) {
        const element = document.getElementById(hash);
        if (element) {
          isScrolling.current = true;
          element.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isScrolling.current = false;
          }, 1000);
        }
      }
    }

    const handleResize = () => setIsLargeScreen(window.innerWidth >= 984);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, menuItems, setActiveItemId]);

  useEffect(() => {
    if (!activeItemId || !window.location.hash) return;
    if (window.location.pathname !== pathname) return;

    history.replaceState(
      { ...history.state, as: `${pathname}#${activeItemId}` },
      "",
      `${pathname}#${activeItemId}`,
    );
  }, [activeItemId, pathname]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    // Check if we're still on the same page
    const currentPath = window.location.pathname;
    const initialPath = pathname;

    if (currentPath !== initialPath) {
      return; // We're on a different page
    }

    const element = document.getElementById(id);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: "smooth" });
      setActiveItemId(id);
      history.replaceState(
        { ...history.state, as: `${currentPath}#${id}` },
        "",
        `${currentPath}#${id}`,
      );
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };

  return (
    <div className="w-fit">
      <Heading
        level={2}
        size={"xs"}
        className="focus--outline focus--primary focus--in mb-md !text-md text-brown-600"
      >
        {menuHeading}
      </Heading>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <AppLink
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`focus--in flex cursor-pointer hyphens-auto p-sm pl-lg text-sm no-underline underline-offset-4 hover:underline ${
                activeItemId === item.id
                  ? "border-l-[0.188rem] border-pink-600 pl-[1.125rem] font-strong"
                  : "focus--underline border-l border-brown-200 font-normal"
              }`}
            >
              {item.text}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
