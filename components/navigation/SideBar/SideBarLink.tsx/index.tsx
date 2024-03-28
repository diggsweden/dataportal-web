import React, {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { usePathname } from "next/navigation";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import NavPixelsImage from "@/assets/icons/navPixels.svg";
import ChevronRightIcon from "@/assets/icons/chevronRight.svg";

const sideBarLinkVariants = cva(
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

type MenuLinkProps = VariantProps<typeof sideBarLinkVariants> & {
  Icon?: any;
  href: string;
  label: string;
  className?: string;
  tabIndex?: number;
  setOpenSideBar: Function;
};

const MenuLink: FC<MenuLinkProps> = ({
  href,
  className,
  label,
  Icon,
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
        sideBarLinkVariants({ variant }),
        "focus--in focus--underline",
        isActive && "bg-pink-100",
        className,
      )}
      href={href}
      tabIndex={tabIndex}
      onClick={() => vw < 600 && setOpenSideBar(false)}
    >
      <>
        {isActive && <NavPixelsImage className="absolute right-none" />}
        {Icon && (
          <Icon
            viewBox="0 0 24 24"
            width={24}
            height={24}
            className={isActive ? "[&_path]:fill-pink-600" : ""}
          />
        )}
        <span
          className={`z-50 underline-offset-4 group-hover:underline ${
            isActive ? "font-strong text-brown-900" : ""
          }`}
        >
          {label}
        </span>
        {variant === "external" && (
          <ExternalLinkIcon
            className="absolute right-md [&_path]:fill-brown-400"
            viewBox="0 0 24 24"
            width={24}
            height={24}
          />
        )}
      </>
    </Link>
  );
};

type SideBarLinkProps = VariantProps<typeof sideBarLinkVariants> & {
  level: "1" | "2";
  icon?: any;
  href?: string;
  label: string;
  list?: any[];
  openSideBar?: boolean;
  setOpenSideBar: Function;
};

const SideBarLink: FC<
  PropsWithChildren<SideBarLinkProps & HTMLAttributes<HTMLElement>>
> = ({
  level,
  href,
  className,
  icon,
  label,
  list,
  openSideBar,
  setOpenSideBar,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const Icon = icon;
  const pathname = usePathname();
  const basePath = `/${pathname.split("/").splice(1, 1)[0]}`;

  useEffect(() => {
    if (!openSideBar && list) {
      const hasActiveLink = list.some(
        (menu) => basePath === `/${t(`routes|${menu.title}$path`)}`,
      );
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
        Icon={Icon}
        className={className}
        tabIndex={openSideBar ? 0 : -1}
        setOpenSideBar={setOpenSideBar}
      />
    );
  }
  if (level === "2" && list) {
    return (
      <>
        <button
          className="focus--in focus--underline group inline-flex w-full cursor-pointer flex-row gap-md p-md text-brown-600"
          onClick={() => setOpen(!open)}
          tabIndex={openSideBar ? 0 : -1}
        >
          <Icon className={open ? "[&_path]:fill-pink-600" : ""} />
          <span
            className={`mr-auto underline-offset-4 group-hover:underline ${
              open && "font-strong text-brown-900"
            }`}
          >
            {label}
          </span>
          <ChevronRightIcon
            className={`${
              open
                ? "rotate-90 transition-all duration-300 ease-in-out [&_path]:fill-pink-600"
                : "rotate-0 transition-all duration-300 ease-in-out"
            }`}
          />
        </button>
        {open && (
          <ul className="flex flex-col">
            {list.map((menu, idx: number) => (
              <li key={idx} className="group relative overflow-y-hidden">
                <MenuLink
                  href={`/${t(`routes|${menu.title}$path`)}`}
                  label={t(`routes|${menu.title}$title`)}
                  className={`pl-[48px] ${className}`}
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

export default SideBarLink;
