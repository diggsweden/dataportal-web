import useTranslation from "next-translate/useTranslation";
import { Dispatch, RefObject, useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Button } from "@/components/button";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import ChevronUpIcon from "@/assets/icons/chevronUp.svg";
import { handleScroll } from "@/utilities/form-utils";
import { createFocusTrap, FocusTrap } from "focus-trap";

interface ContainerDpDwnProps {
  pageNames: string[];
  setPage: Dispatch<React.SetStateAction<number>>;
  scrollRef: RefObject<HTMLSpanElement>;
  className?: string;
  forceUpdate?: number;
}

export const FormNav: React.FC<ContainerDpDwnProps> = ({
  pageNames,
  className,
  setPage,
  forceUpdate,
  scrollRef,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [curActive, setCurActive] = useState("");
  const { t } = useTranslation("common");
  const [vw, setVw] = useState(0);
  const navRef = useRef<HTMLUListElement>(null);
  useClickOutside(() => setExpanded(false), [], navRef);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    setCurActive(pageNames[0]);
    const handleResize = () => setVw(window.innerWidth);

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (expanded && vw < 984 && navRef.current) {
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

  useEffect(() => {
    forceUpdate && setCurActive(pageNames[forceUpdate]);
  }, [forceUpdate]);

  const handleClick = (pageName: string) => {
    setCurActive(pageName);
    setExpanded(false);
    setPage(pageNames.indexOf(pageName) + 1);
    handleScroll(scrollRef);
  };

  const isActive = (pageName: string) => {
    return curActive === pageName;
  };

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

  return (
    <nav
      ref={navRef}
      className={`relative row-start-1 mb-lg flex h-fit w-full lg:col-span-1 lg:col-start-1 
      lg:row-span-2 lg:mb-xl ${className ? className : ""}`}
      aria-label={t("common|menu-form")}
      onKeyDown={handleEscape}
    >
      {expanded && (
        <div
          className="fixed left-none top-none z-30 h-screen w-screen bg-brownOpaque5 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* This is added so a user can tab through the page when the button is not visible */}
      {vw < 984 && (
        <Button
          iconPosition="right"
          icon={expanded ? ChevronUpIcon : ChevronDownIcon}
          label={curActive === "" ? t("go-to") : curActive}
          onClick={() => setExpanded(!expanded)}
          className={`!button--large z-40 !w-full justify-between md:!w-[328px] lg:hidden`}
          aria-expanded={expanded}
          aria-controls="form-nav"
          aria-label={
            expanded
              ? `${t("common|close")} ${t("common|menu-form")} navigation`
              : `${t("common|open")} ${t("common|menu-form")} navigation`
          }
        />
      )}
      <ul
        id="form-nav"
        className={`absolute w-full flex-col bg-white md:w-[328px] lg:static lg:flex lg:h-full lg:w-fit 
        lg:bg-transparent ${
          expanded
            ? `-bottom-sm z-40 h-fit max-h-[calc(100svh-292px)] translate-y-full overflow-y-auto 
            shadow-2xl md:max-h-[calc(100svh-248px)]`
            : "hidden"
        }`}
        aria-label={`${t("common|menu-form")} navigation`}
      >
        {pageNames.map((name, idx: number) => {
          return (
            <li
              key={`name-${idx}`}
              tabIndex={0}
              className={`focus--outline focus--primary focus--in cursor-pointer p-md no-underline underline-offset-4
               ${
                 isActive(name)
                   ? "!cursor-default bg-brown-900 text-white"
                   : "focus--underline text-textSecondary hover:underline"
               }`}
              onClick={() => handleClick(name)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick(name);
                }
              }}
            >
              {name}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
