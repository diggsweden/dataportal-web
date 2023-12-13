import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useClickoutside } from "../../hooks/useClickoutside";

interface ContainerDpDwnProps {
  pageNames: string[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  forceUpdate?: number;
}

export const FormDropdownNavigation: React.FC<ContainerDpDwnProps> = ({
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
    <div ref={ref} className={className || ""}>
      <button
        className="mw px height"
        aria-haspopup={true}
        aria-expanded={expanded}
        onClick={(e) => {
          e.preventDefault();
          setExpanded(!expanded);
        }}
      >
        <span className="button--content">
          <span>{curActive === "" ? t("go-to") : curActive}</span>
          {/*<ArrowBreadcrumbIcon*/}
          {/*  width={18}*/}
          {/*  rotation={expanded ? -90 : 90}*/}
          {/*  color={colorPalette.white}*/}
          {/*/>*/}
        </span>
      </button>
      {expanded && (
        <nav className="mw navigation" aria-label="kategori">
          <ul>
            {pageNames.map((name) => {
              return (
                <li
                  className={`navigation--item px height${
                    isActive(name) ? " active" : ""
                  }`}
                  onClick={(e) => handleClick(e, name)}
                  key={name}
                >
                  <Link href={""}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};
