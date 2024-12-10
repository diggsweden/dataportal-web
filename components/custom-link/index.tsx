import { cx } from "class-variance-authority";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC, LinkHTMLAttributes, PropsWithChildren, useContext } from "react";

import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import MailIcon from "@/assets/icons/mail.svg";
import { SettingsContext } from "@/providers/settings-provider";
import { isMailLink } from "@/utilities";

type CustomLinkProps = {
  href: string;
};

export const CustomLink: FC<
  PropsWithChildren<CustomLinkProps & LinkHTMLAttributes<HTMLAnchorElement>>
> = ({ className, children, href, ...rest }) => {
  const { iconSize } = useContext(SettingsContext);
  const { t } = useTranslation();

  return (
    <Link
      href={href}
      className={cx(
        "cursor-pointer [&_svg]:mb-[2px] [&_svg]:ml-xs [&_svg]:inline-block",
        className,
      )}
      {...rest}
    >
      {children}
      {isMailLink(href) ? (
        <>
          <MailIcon width={iconSize} height={iconSize} viewBox="0 0 24 24" />
          <span className="sr-only">{t("common|open-in-email")}</span>
        </>
      ) : (
        <>
          <ExternalLinkIcon
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
          />
          <span className="sr-only">{t("common|open-in-new-tab")}</span>
        </>
      )}
    </Link>
  );
};
