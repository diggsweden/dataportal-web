import React, { FC, PropsWithChildren, AnchorHTMLAttributes } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { usePathname } from "next/navigation";
import ExternalLink from "@/assets/icons/external-link.svg";
import NavPixels from "@/assets/icons/navPixels.svg";

const navLinkVariants = cva(
  [
    "flex w-full flex-row items-center gap-md p-md group text-md text-brown-600 overflow-y-hidden relative",
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

type NavLinkProps = VariantProps<typeof navLinkVariants> & {
  icon?: any;
  href: string;
  label: string;
};

const NavLink: FC<
  PropsWithChildren<NavLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ variant, href, className, icon, label, ...rest }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const Icon = icon;

  const isActive =
    pathname === href || (pathname === "/" && href === t(`common|lang-path`));

  return (
    <Link
      className={cx(
        navLinkVariants({ variant }),
        isActive && "bg-pink-100",
        className,
      )}
      href={href}
      target={variant === "external" ? "_blank" : "_self"}
      {...rest}
    >
      <>
        {isActive && <NavPixels className="absolute right-none" />}
        <Icon
          viewBox="0 0 24 24"
          width={24}
          height={24}
          className={isActive && "[&_path]:fill-pink-600"}
        />
        <span
          className={`z-50 underline-offset-4 group-hover:underline ${
            isActive && "font-strong text-brown-900"
          }`}
        >
          {label}
        </span>
        {variant === "external" && (
          <ExternalLink
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

export default NavLink;
