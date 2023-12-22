import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    return () => {
      window.addEventListener("resize", () => setExpanded(false));
    };
  }, [expanded]);

  const { asPath } = useRouter() || {};

  const isActive = (url: string) => {
    return asPath === url;
  };

  return (
    <div
      className={`row-start-1 lg:static lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:flex ${
        expanded
          ? `absolute left-none top-none mr-none h-full w-screen bg-brown-800 px-sm py-md
           md:relative md:w-fit md:bg-transparent md:p-none md:py-none lg:static`
          : "flex"
      }`}
    >
      <Button
        iconPosition="left"
        icon={expanded ? CloseCrossIcon : HamburgerIcon}
        label={related[0].name}
        onClick={() => setExpanded(!expanded)}
        className={`w-full md:w-[320px] lg:hidden ${
          expanded ? "my-sm md:mb-lg md:mt-none" : "mb-lg"
        }`}
      />
      <ul
        className={`flex w-full flex-col bg-white  md:absolute md:w-[320px] lg:relative lg:flex lg:bg-transparent ${
          expanded
            ? "h-fit max-h-[calc(100vh-80px)] overflow-y-scroll md:-mt-sm md:max-h-[calc(100vh-228px)]"
            : "hidden "
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
                onClick={() =>
                  setTimeout(() => {
                    setExpanded(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 300)
                }
                scroll={false}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/*    <button
        className="mw px height"
        aria-haspopup={true}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="button--content">
          <span>{t("go-to")}</span>
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
      )} */}
    </div>
  );
};

export default ContainerNav;
