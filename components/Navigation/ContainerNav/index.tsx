import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { RelatedContainerFragment } from "@/graphql/__generated__/operations";
import { Button } from "@/components/global/Button";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";

interface ContainerDpDwnProps {
  related: RelatedContainerFragment[];
  domain?: DiggDomain;
}

const ContainerNav: React.FC<ContainerDpDwnProps> = ({ related, domain }) => {
  const [expanded, setExpanded] = useState(false);

  const { asPath } = useRouter() || {};

  const isActive = (url: string) => {
    return asPath === url;
  };

  return (
    <nav
      className={`relative flex h-fit xl:col-span-1 xl:col-start-1 xl:row-span-2`}
    >
      {expanded && (
        <div className="bg-brownOpaque5 fixed left-none top-none z-30 h-screen w-screen md:hidden" />
      )}

      <Button
        iconPosition="left"
        icon={expanded ? CloseCrossIcon : HamburgerIcon}
        label={related[0].name}
        onClick={() => setExpanded(!expanded)}
        className={`z-40 w-full md:w-[320px] xl:hidden`}
      />
      <ul
        className={`absolute flex-col bg-white md:w-[320px] xl:static xl:flex xl:h-full xl:bg-transparent ${
          expanded
            ? "top-[56px] z-40 h-fit max-h-[calc(100vh-252px)] w-full overflow-y-scroll"
            : "hidden"
        }`}
      >
        {related.map(({ name, slug }) => {
          const url = `${domain ? "/" + domain : ""}${slug}`;
          return (
            <li
              className={`${
                isActive(url) ? " bg-brown-900 text-white" : "text-brown-600"
              }`}
              key={slug}
            >
              <Link
                href={url}
                className={`inline-flex w-full px-md py-sm no-underline ${
                  isActive(url) ? "cursor-default" : "hover:underline"
                }`}
                aria-disabled={isActive(url)}
                onClick={() => {
                  setExpanded(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
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

export default ContainerNav;
