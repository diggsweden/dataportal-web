"use client";

import { createFocusTrap, type FocusTrap } from "focus-trap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import CrossIcon from "@/assets/icons/cross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { Button } from "@/components/button";
import { ParentSimplifiedFragment } from "@/graphql/__generated__/operations";
import { useClickOutside } from "@/hooks/use-click-outside";

interface ContainerDpDwnProps {
  related: ParentSimplifiedFragment[];
  parent?: string;
}

export const ContainerNav: FC<ContainerDpDwnProps> = ({ related }) => {
  const sectionLabel =
    related[0].name || related[0].heading || related[0].slug || "";
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const [vw, setVw] = useState(0);
  const t = useTranslations();
  const navRef = useRef<HTMLUListElement>(null);
  useClickOutside(() => setExpanded(false), [], navRef);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (expanded && vw < 1124 && navRef.current) {
      trapRef.current = createFocusTrap(navRef.current, {
        escapeDeactivates: false,
        allowOutsideClick: true,
      });
      trapRef.current.activate();
    }

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
    };
  }, [expanded, vw]);

  const handleToggle = () => {
    if (expanded) {
      trapRef.current?.deactivate();
    }
    setExpanded(!expanded);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && expanded) {
      handleToggle();
    }
  };

  const isActive = (url: string) => {
    const firstSlug = related[0].slug || "";
    if (url === firstSlug || url.endsWith(firstSlug)) {
      return pathname === url;
    } else {
      return (pathname ?? "").startsWith(url) && pathname !== firstSlug;
    }
  };

  return (
    <nav
      ref={navRef}
      className="relative"
      aria-label={t("common.menu-container")}
      onKeyDown={handleEscape}
    >
      {expanded && (
        // biome-ignore lint/a11y/useSemanticElements: overlay backdrop with click handler
        <div
          role="button"
          tabIndex={0}
          className="fixed left-none top-none z-30 h-screen w-screen bg-brownOpaque5 md:hidden"
          onClick={() => setExpanded(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setExpanded(false);
          }}
        />
      )}

      {/* This is added so a user can tab through the page when the button is not visible */}
      {vw < 1124 && (
        <Button
          iconPosition="left"
          icon={expanded ? CrossIcon : HamburgerIcon}
          label={sectionLabel}
          onClick={handleToggle}
          className={`!button--large relative z-40 w-full md:w-[20rem] xl:hidden`}
          aria-expanded={expanded}
          aria-controls="container-nav"
          aria-label={
            expanded
              ? `${t("common.close")} ${sectionLabel}`
              : `${t("common.open")} ${sectionLabel}`
          }
        />
      )}

      <ul
        id="container-nav"
        className={`absolute flex-col bg-white md:w-[20rem] xl:static xl:flex xl:h-full xl:w-[200px] xl:bg-transparent ${
          expanded
            ? "-bottom-sm z-40 h-fit max-h-[calc(100svh-18.25rem)] w-full translate-y-full overflow-y-auto md:max-h-[calc(100vh-18.25rem)]"
            : "hidden"
        }`}
        aria-label={`${sectionLabel} navigation`}
      >
        {related.map(({ name, slug, heading }, index) => {
          const label = name || heading || slug || "";
          const href = slug || "#";
          return (
            <li
              className={`${
                isActive(href) ? " bg-brown-900 text-white" : "text-brown-600"
              }`}
              key={slug || `nav-${index}`}
            >
              <Link
                href={href}
                className={`focus--in inline-flex w-full px-md py-sm no-underline ${
                  isActive(href)
                    ? "cursor-default"
                    : "focus--underline hover:underline"
                }`}
                aria-disabled={isActive(href)}
                onClick={() => {
                  setExpanded(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setExpanded(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                scroll={false}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
