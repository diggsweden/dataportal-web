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
import { Related_containers } from "../../graphql/__generated__/Related";
import { useClickoutside } from "../../hooks/useClickoutside";

interface ContainerDpDwnProps {
  related: Related_containers[];
  domain?: DiggDomain;
  className?: string;
}

const styles = css`
  position: relative;
  ${space({ mt: 12 })};

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

export const ContainerNavigation: React.FC<ContainerDpDwnProps> = ({
  related,
  domain,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useClickoutside(() => setExpanded(false));
  const { t } = useTranslation("common");
  const { push, asPath } = useRouter() || {};

  const handleClick = (url: string) => {
    push(url);
    setExpanded(false);
  };

  const isActive = (url: string) => {
    return asPath === url;
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
        onClick={() => setExpanded(!expanded)}
      >
        <span className="button--content">
          <span>{t("go-to")}</span>
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
            {related.map(({ name, slug }) => {
              const url = `${domain ? "/" + domain : ""}${slug}`;
              return (
                <li
                  className={`navigation--item px height${
                    isActive(url) ? " active" : ""
                  }`}
                  onClick={() => handleClick(url)}
                  key={slug}
                >
                  <Link href={url}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};
