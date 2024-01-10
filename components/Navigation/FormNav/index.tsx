import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";
import { Button } from "@/components/global/Button";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import ChevronUpIcon from "@/assets/icons/chevronUp.svg";

interface ContainerDpDwnProps {
  pageNames: string[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  forceUpdate?: number;
}

export const FormNav: React.FC<ContainerDpDwnProps> = ({
  pageNames,
  className,
  setPage,
  forceUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [curActive, setCurActive] = useState("");
  const ref = useClickoutside(() => setExpanded(false));
  const { t } = useTranslation("common");

  useEffect(() => {
    setCurActive(pageNames[0]);
  }, []);

  useEffect(() => {
    forceUpdate && setCurActive(pageNames[forceUpdate]);
  }, [forceUpdate]);

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement>,
    pageName: string,
  ) => {
    e.preventDefault();
    setCurActive(pageName);
    setExpanded(false);
    setPage(pageNames.indexOf(pageName) + 1);
  };

  const isActive = (pageName: string) => {
    return curActive === pageName;
  };

  return (
    <nav ref={ref} className={`relative mb-lg ${className ? className : ""}}`}>
      <Button
        iconPosition="right"
        icon={expanded ? ChevronUpIcon : ChevronDownIcon}
        aria-haspopup={true}
        label={curActive === "" ? t("go-to") : curActive}
        onClick={() => setExpanded(!expanded)}
        className={`w-[328px] justify-between border !bg-white text-textPrimary hover:border-2 hover:bg-white `}
        variant={"secondary"}
      />

      {expanded && (
        <ul
          className={`absolute w-[328px] flex-col bg-white ${
            expanded
              ? "-bottom-sm z-40 h-fit max-h-[calc(100vh-252px)] translate-y-full overflow-y-scroll shadow-2xl"
              : "hidden"
          }`}
        >
          {pageNames.map((name) => {
            return (
              <li
                key={name}
                className={`cursor-pointer p-md hover:bg-brown-100 ${
                  isActive(name) ? "!cursor-default bg-brown-100" : ""
                }`}
                onClick={(e) => handleClick(e, name)}
              >
                {name}
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};
