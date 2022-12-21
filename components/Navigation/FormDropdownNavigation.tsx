import {
  ArrowBreadcrumbIcon,
  Button,
  colorPalette,
  css,
  space,
} from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useClickoutside } from "../../hooks/useClickoutside";

interface ContainerDpDwnProps {
  pageNames: string[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  forceUpdate?: number;
}

const styles = css`
  position: relative;

  z-index: 9999;
  .height {
    min-height: 44px;
  }
  .mw {
    max-width: 330px;
  }
  .px {
    ${space({ px: 4 })}
  }

  .button--content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navigation {
    z-index: 100;
    width: 100%;
    position: absolute;
    top: 44px;
    display: flex;
    flex-direction: column;

    ul {
      padding: 0;
      margin: 0;
    }
  }

  .navigation--item {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: ${colorPalette.gray800};
    border-top: 1px solid ${colorPalette.black};

    a {
      color: ${colorPalette.white};
    }

    &:hover {
      a {
        text-decoration: underline;
      }
    }
  }

  .active {
    background-color: ${colorPalette.pinkPop};
    a {
      color: ${colorPalette.gray900};
    }
  }

  .navigation {
    .navigation--item {
      ${space({ py: 4, px: 4 })}
    }
  }
`;

const buttonColors: ColorGroupOverride = {
  accent: "white",
  background: "gray800",
  border: "gray800",
  font: "white",
};

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
    pageName: string
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
    <div css={styles} ref={ref} className={className || ""}>
      <Button
        className="mw px height"
        aria-haspopup={true}
        aria-expanded={expanded}
        theming={{
          normalColors: buttonColors,
          hoverColors: buttonColors,
          activeColors: buttonColors,
        }}
        onClick={(e) => {
          e.preventDefault();
          setExpanded(!expanded);
        }}
      >
        <span className="button--content">
          <span>{curActive === "" ? t("go-to") : curActive}</span>
          <ArrowBreadcrumbIcon
            width={18}
            rotation={expanded ? -90 : 90}
            color={colorPalette.white}
          />
        </span>
      </Button>
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
