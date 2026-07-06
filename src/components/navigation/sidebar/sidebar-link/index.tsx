"use client";

import { cva, cx, type VariantProps } from "class-variance-authority";
import parse from "html-react-parser";
import { useTranslations } from "next-intl";
import {
  type FC,
  type HTMLAttributes,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import PixelsImage from "@/assets/icons/pixels.svg";
import { AppLink } from "@/components/link";
import type { MenuLinkFragment } from "@/graphql/gql/graphql";
import { usePathname } from "@/i18n/navigation";
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
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <AppLink
      className={cx(
        sidebarLinkVariants({ variant }),
        "focus--in focus--underline whitespace-normal",
        isActive && "bg-pink-100",
        className,
      )}
      href={href}
      tabIndex={tabIndex}
      // Read width inside the handler (not at render time) — event handlers
      // never fire during SSR so `window` is guaranteed to exist here. Also
      // catches post-mount viewport resizes, which the old render-time read
      // missed (it captured width at first render and went stale).
      onClick={() => window.innerWidth < 600 && setOpenSideBar(false)}
      data-tracking-name="sidebar-link"
    >
      {isActive && <PixelsImage className="absolute right-none text-white" />}
      {icon && (
        <span
          className={`flex-shrink-0 ${isActive ? "text-pink-600" : ""}`}
          aria-hidden="true"
        >
          {parse(icon)}
        </span>
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
    </AppLink>
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
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const { iconSize } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    if (!openSideBar && list) {
      const hasActiveLink = list.some((menu) => pathname === menu.link);
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
          type="button"
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
              ? `${t("common.close")} ${t("common.menu-submenu")} ${label}`
              : `${t("common.open")} ${t("common.menu-submenu")} ${label}`
          }
        >
          {icon && (
            <span
              className={`flex-shrink-0 ${open ? "text-pink-600" : ""}`}
              aria-hidden="true"
            >
              {parse(icon)}
            </span>
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
            {list.map((menu: MenuLinkFragment) => (
              <li key={menu.link} className="group relative overflow-y-hidden">
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
