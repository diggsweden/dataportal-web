import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { RelatedContainerFragment } from "../../graphql/__generated__/operations";
import { useClickoutside } from "../../hooks/useClickoutside";

interface ContainerDpDwnProps {
  related: RelatedContainerFragment[];
  domain?: DiggDomain;
  className?: string;
}

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
    <div ref={ref} className={className || ""}>
      <button
        className="mw px height"
        aria-haspopup={true}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="button--content">
          <span>{t("go-to")}</span>
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
