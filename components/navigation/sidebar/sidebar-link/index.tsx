import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import React, {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import PixelsImage from "@/assets/icons/pixels.svg";
import { MenuLinkFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { isExternalLink } from "@/utilities";

const sidebarLinkVariants = cva(
  [
    "flex w-full cursor-pointer flex-row no-underline items-center gap-md p-md group text-md text-brown-600 overflow-y-hidden relative",
  ],
  {
    variants: {
      variant: {
        internal: ["pr-lg"],
        external: ["pr-xl"],
      },
    },
    defaultVariants: {
      variant: "internal",
    },
  },
);

type MenuLinkProps = VariantProps<typeof sidebarLinkVariants> & {
  icon?: string;
  iconSize: number;
  href: string;
  label: string;
  className?: string;
  tabIndex?: number;
  setOpenSideBar: (_param: boolean) => void;
};

const MenuLink: FC<MenuLinkProps> = ({
  href,
  className,
  label,
  icon,
  iconSize,
  variant,
  tabIndex,
  setOpenSideBar,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const basePath = `/${pathname.split("/").splice(1, 1)[0]}`;
  const vw = window.innerWidth;

  const isActive =
    (pathname === "/" && href === t(`common|lang-path`)) || href === basePath;

  return (
    <Link
      className={cx(
        sidebarLinkVariants({ variant }),
        "focus--in focus--underline whitespace-normal",
        isActive && "bg-pink-100",
        className,
      )}
      href={href}
      tabIndex={tabIndex}
      onClick={() => vw < 600 && setOpenSideBar(false)}
      data-tracking-name="sidebar-link"
    >
      <>
        {isActive && <PixelsImage className="absolute right-none text-white" />}
        {icon && (
          <span
            dangerouslySetInnerHTML={{ __html: icon }}
            className={`flex-shrink-0 ${isActive ? "text-pink-600" : ""}`}
          />
        )}
        <span
          className={`z-50 underline-offset-4 group-hover:underline ${
            isActive ? "font-strong text-brown-900" : ""
          }`}
        >
          {label}
        </span>
        {isExternalLink(href) && (
          <ExternalLinkIcon
            className="absolute right-md text-brown-400"
            viewBox="0 0 24 24"
            width={1.5 * iconSize}
            height={1.5 * iconSize}
          />
        )}
      </>
    </Link>
  );
};

type SideBarLinkProps = VariantProps<typeof sidebarLinkVariants> & {
  level: "1" | "2";
  icon?: string;
  href?: string;
  label: string;
  list?: MenuLinkFragment[];
  variant?: "external" | "internal";
  openSideBar?: boolean;
  setOpenSideBar: (_param: boolean) => void;
};

export const SidebarLink: FC<
  PropsWithChildren<SideBarLinkProps & HTMLAttributes<HTMLElement>>
> = ({
  level,
  href,
  icon,
  label,
  list,
  variant,
  openSideBar,
  setOpenSideBar,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { iconSize } = useContext(SettingsContext);
  const pathname = usePathname();
  const basePath = `/${pathname.split("/").splice(1, 1)[0]}`;

  useEffect(() => {
    if (!openSideBar && list) {
      const hasActiveLink = list.some((menu) => basePath === menu.link);
      if (!hasActiveLink) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [pathname, list]);

  if (level === "1" && href) {
    return (
      <MenuLink
        href={href}
        label={label}
        icon={icon}
        iconSize={iconSize}
        variant={variant}
        tabIndex={openSideBar ? 0 : -1}
        setOpenSideBar={setOpenSideBar}
      />
    );
  }
  if (level === "2" && list) {
    return (
      <>
        <button
          className={`focus--in focus--underline group flex w-full cursor-pointer flex-row items-center
            gap-md whitespace-normal p-md text-left text-brown-600 ${
              open && "font-strong text-brown-900"
            }`}
          onClick={() => setOpen(!open)}
          tabIndex={openSideBar ? 0 : -1}
          aria-expanded={open}
          aria-controls={`submenu-${label.replace(/\s+/g, "-").toLowerCase()}`}
          aria-label={
            open
              ? `${t("common|close")} ${t("common|menu-submenu")} ${label}`
              : `${t("common|open")} ${t("common|menu-submenu")} ${label}`
          }
        >
          {icon && (
            <span
              dangerouslySetInnerHTML={{ __html: icon }}
              className={`flex-shrink-0 ${open ? "text-pink-600" : ""}`}
            />
          )}
          <span
            className={`mr-auto underline-offset-4 group-hover:underline ${
              open && "font-strong text-brown-900"
            }`}
          >
            {label}
          </span>
          <ChevronRightIcon
            width={1.5 * iconSize}
            height={1.5 * iconSize}
            viewBox="0 0 24 24"
            className={`flex-shrink-0 ${
              open
                ? "rotate-90 transition-all duration-300 ease-in-out [&_path]:fill-pink-600"
                : "rotate-0 transition-all duration-300 ease-in-out"
            }`}
          />
        </button>
        {open && (
          <ul
            id={`submenu-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className="flex flex-col"
          >
            {list.map((menu: MenuLinkFragment, idx: number) => (
              <li key={idx} className="group relative overflow-y-hidden">
                <MenuLink
                  href={menu.link}
                  label={menu.name}
                  className={`pl-[3rem]`}
                  iconSize={iconSize}
                  tabIndex={openSideBar ? 0 : -1}
                  setOpenSideBar={setOpenSideBar}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
};
