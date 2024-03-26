import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ContainerDataFragment } from "@/graphql/__generated__/operations";
import { Button } from "@/components/global/Button";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";

interface ContainerDpDwnProps {
  related: ContainerDataFragment[];
  parent?: string;
}

export const ContainerNav: FC<ContainerDpDwnProps> = ({ related }) => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const [vw, setVw] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => setVw(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setVw(window.innerWidth));
  }, []);

  const isActive = (url: string) => {
    if (url === related[0].slug || url.endsWith(related[0].slug)) {
      return pathname === url;
    } else {
      return pathname.startsWith(url) && pathname !== related[0].slug;
    }
  };

  return (
    <nav className="relative" aria-label="Container main">
      {expanded && (
        <div className="fixed left-none top-none z-30 h-screen w-screen bg-brownOpaque5 md:hidden" />
      )}

      {/* This is added so a user can tab through the page when the button is not visible */}
      {vw < 1124 && (
        <Button
          iconPosition="left"
          icon={expanded ? CloseCrossIcon : HamburgerIcon}
          label={related[0].heading}
          onClick={() => setExpanded(!expanded)}
          className={`!button--large relative z-40 w-full md:w-[320px] xl:hidden`}
        />
      )}

      <ul
        className={`absolute flex-col bg-white md:w-[320px] xl:static xl:flex xl:h-full xl:w-[200px] xl:bg-transparent ${
          expanded
            ? "-bottom-sm z-40 h-fit max-h-[calc(100svh-292px)] w-full translate-y-full overflow-y-auto md:max-h-[calc(100vh-292px)]"
            : "hidden"
        }`}
      >
        {related.map(({ name, slug }) => {
          return (
            <li
              className={`${
                isActive(slug) ? " bg-brown-900 text-white" : "text-brown-600"
              }`}
              key={slug}
            >
              <Link
                href={slug}
                className={`inline-flex w-full px-md py-sm no-underline ${
                  isActive(slug)
                    ? "cursor-default"
                    : "focus--underline hover:underline"
                }`}
                aria-disabled={isActive(slug)}
                onClick={() => {
                  setExpanded(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setExpanded(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
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
