import useTranslation from "next-translate/useTranslation";
import { Dispatch, RefObject, useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";
import { Button } from "@/components/global/Button";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import ChevronUpIcon from "@/assets/icons/chevronUp.svg";
import { handleScroll } from "@/utilities/formUtils";

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
  const ref = useClickoutside(() => setExpanded(false));
  const { t } = useTranslation("common");
  const [vw, setVw] = useState(0);

  useEffect(() => {
    setCurActive(pageNames[0]);
    setVw(window.innerWidth);
  }, []);

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

  return (
    <nav
      ref={ref}
      className={`relative row-start-1 mb-lg flex h-fit w-full lg:col-span-1 lg:col-start-1 
      lg:row-span-2 lg:mb-xl ${className ? className : ""}`}
    >
      {expanded && (
        <div className="fixed left-none top-none z-30 h-screen w-screen bg-brownOpaque5 md:hidden" />
      )}

      {/* This is added so a user can tab through the page when the button is not visible */}
      {vw < 984 && (
        <Button
          iconPosition="right"
          icon={expanded ? ChevronUpIcon : ChevronDownIcon}
          aria-haspopup={true}
          label={curActive === "" ? t("go-to") : curActive}
          onClick={() => setExpanded(!expanded)}
          className={`!button--large z-40 !w-full justify-between md:!w-[328px] lg:hidden`}
        />
      )}
      <ul
        className={`absolute w-full flex-col bg-white md:w-[328px] lg:static lg:flex lg:h-full lg:w-fit 
        lg:bg-transparent ${
          expanded
            ? `-bottom-sm z-40 h-fit max-h-[calc(100svh-292px)] translate-y-full overflow-y-auto 
            shadow-2xl md:max-h-[calc(100svh-248px)]`
            : "hidden"
        }`}
      >
        {pageNames.map((name, idx: number) => {
          return (
            <li
              key={`name-${idx}`}
              tabIndex={0}
              className={`focus--outline focus--primary focus--out cursor-pointer p-md no-underline underline-offset-4
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
