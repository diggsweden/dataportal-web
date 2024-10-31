import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { ContainerDataFragment } from "@/graphql/__generated__/operations";
import { Button } from "@/components/global/Button";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { createFocusTrap, FocusTrap } from "focus-trap";
import { useClickOutside } from "@/hooks/useClickOutside";

interface ContainerDpDwnProps {
  related: ContainerDataFragment[];
  parent?: string;
}

export const ContainerNav: FC<ContainerDpDwnProps> = ({ related }) => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const [vw, setVw] = useState(0);
  const { t } = useTranslation();
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

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && expanded) {
      handleToggle();
    }
  };

  const isActive = (url: string) => {
    if (url === related[0].slug || url.endsWith(related[0].slug)) {
      return pathname === url;
    } else {
      return pathname.startsWith(url) && pathname !== related[0].slug;
    }
  };

  return (
    <nav
      ref={navRef}
      className="relative"
      aria-label={t("common|menu-container")}
      onKeyDown={handleEscape}
    >
      {expanded && (
        <div
          className="fixed left-none top-none z-30 h-screen w-screen bg-brownOpaque5 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* This is added so a user can tab through the page when the button is not visible */}
      {vw < 1124 && (
        <Button
          iconPosition="left"
          icon={expanded ? CloseCrossIcon : HamburgerIcon}
          label={related[0].name}
          onClick={handleToggle}
          className={`!button--large relative z-40 w-full md:w-[20rem] xl:hidden`}
          aria-expanded={expanded}
          aria-controls="container-nav"
          aria-label={
            expanded
              ? `${t("common|close")} ${related[0].name}`
              : `${t("common|open")} ${related[0].name}`
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
        aria-label={`${related[0].name} navigation`}
      >
        {related.map(({ name, slug }) => {
          return (
            <li
              className={`${
                isActive(slug) ? " bg-brown-900 text-white" : "text-brown-600"
              }`}
              key={slug}
            >
              <Link
                href={slug}
                className={`focus--in inline-flex w-full px-md py-sm no-underline ${
                  isActive(slug)
                    ? "cursor-default"
                    : "focus--underline hover:underline"
                }`}
                aria-disabled={isActive(slug)}
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
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
