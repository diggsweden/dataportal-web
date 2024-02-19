import { isMailLink } from "@/utilities";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { FC, LinkHTMLAttributes, PropsWithChildren } from "react";
import MailIcon from "@/assets/icons/mail.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";

type CustomLinkProps = {
  href: string;
};

export const CustomLink: FC<
  PropsWithChildren<CustomLinkProps & LinkHTMLAttributes<HTMLAnchorElement>>
> = ({ className, children, href, ...rest }) => {
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
        <MailIcon width={16} height={16} viewBox="0 0 24 24" />
      ) : (
        <ExternalLinkIcon width={16} height={16} viewBox="0 0 24 24" />
      )}
    </Link>
  );
};
