import { createFocusTrap, FocusTrap } from "focus-trap";
import useTranslation from "next-translate/useTranslation";
import {
  Dispatch,
  FC,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import CheckIcon from "@/assets/icons/check-circle.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import { Button } from "@/components/button";
import { useClickOutside } from "@/hooks/use-click-outside";
import { handleScroll } from "@/utilities/form-utils";

interface ContainerDpDwnProps {
  pageNames: string[];
  setPage: Dispatch<SetStateAction<number>>;
  scrollRef: RefObject<HTMLSpanElement>;
  className?: string;
  forceUpdate?: number;
  countQuestionsPerSection?: {
    title: string;
    count: number;
    answered: number;
  }[];
}

export const FormNav: FC<ContainerDpDwnProps> = ({
  pageNames,
  className,
  setPage,
  countQuestionsPerSection,
  forceUpdate,
  scrollRef,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [curActive, setCurActive] = useState("");
  const { t } = useTranslation("");
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
    if (forceUpdate !== undefined) {
      setCurActive(pageNames[forceUpdate]);
    }
  }, [forceUpdate, pageNames]);

  const handleClick = (pageName: string) => {
    const pageIndex = pageNames.indexOf(pageName);
    setCurActive(pageName);
    setExpanded(false);
    setPage(pageIndex + 1);
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

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && expanded) {
      handleToggle();
    }
  };

  const doneSection = (idx: number) => {
    const done =
      countQuestionsPerSection &&
      countQuestionsPerSection[idx] &&
      countQuestionsPerSection[idx].answered ===
        countQuestionsPerSection[idx].count;

    return done;
  };

  return (
    <div>
      <span className="text-lg text-textSecondary">
        {t("pages|form$sections")}
      </span>
      <nav
        ref={navRef}
        className={`relative row-start-1 mb-lg mt-xl flex h-fit w-full lg:col-span-1 lg:col-start-1 
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
            label={curActive === "" ? t("common:go-to") : curActive}
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
          className={`absolute w-full flex-col gap-md bg-white md:w-[328px] lg:static lg:flex lg:h-full lg:w-fit 
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
                className={`focus--outline focus--primary focus--in relative flex cursor-pointer flex-col gap-sm border-b border-brown-600 p-md text-textPrimary lg:max-w-[200px] lg:rounded-md lg:border
               ${
                 isActive(name)
                   ? "!cursor-default !border-l-8 border-brown-600 lg:ml-md"
                   : "focus--underline text-textSecondary"
               }
               ${
                 doneSection(idx)
                   ? "bg-green-100"
                   : "focus--underline text-textSecondary"
               }
               `}
                onClick={() => handleClick(name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(name);
                  }
                }}
              >
                <span className="break-words">{name}</span>
                {idx !== 0 &&
                  countQuestionsPerSection &&
                  countQuestionsPerSection[idx]?.count > 0 && (
                    <span className="relative flex items-center gap-sm">
                      - {countQuestionsPerSection[idx].count}{" "}
                      {countQuestionsPerSection[idx].count === 1
                        ? t("pages|form$question").toLowerCase()
                        : t("pages|form$questions").toLowerCase()}
                      {doneSection(idx) && `/ ${t("pages|form$done")}`}
                      {doneSection(idx) && (
                        <CheckIcon className="h-4 w-4 ml-auto shrink-0 [&_path]:fill-green-600" />
                      )}
                    </span>
                  )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
