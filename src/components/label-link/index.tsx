"use client";

import { cva, cx } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import MailIcon from "@/assets/icons/mail.svg";
import { AppLink } from "@/components/link";
import type { LabelLink as LabelLinkValue } from "@/lib/entrystore/entrystore-core";
import { SettingsContext } from "@/providers/settings-provider";
import { isMailLink } from "@/utilities";

// `color` doubles as the link colour: the url branch always selects "link"
// (green); the no-url text branch uses the caller's colour (default "dark").
const linkVariants = cva("inline-block w-fit hover:no-underline", {
  variants: {
    size: {
      large: "text-lg",
      medium: "text-md",
      small: "text-sm",
    },
    color: {
      light: "text-brown-100",
      dark: "text-textSecondary",
      primary: "text-textPrimary",
      link: "text-green-600",
    },
  },
  defaultVariants: {
    size: "large",
    color: "dark",
  },
});

interface LabelLinkProps {
  value?: LabelLinkValue | null;
  size?: "large" | "medium" | "small";
  color?: "light" | "dark" | "primary";
  className?: string;
  testId?: string;
}

export function LabelLink({
  value,
  size = "large",
  color = "dark",
  className,
  testId,
}: LabelLinkProps) {
  const { iconSize } = useContext(SettingsContext);
  const t = useTranslations();

  if (!value?.title) return null;
  const { title, url } = value;
  if (url) {
    const isUrlText = title === url;
    return (
      <AppLink
        data-test-id={testId}
        href={url}
        className={cx(
          linkVariants({ size, color: "link" }),
          isUrlText ? "break-all" : "break-words",
          className,
        )}
      >
        {title}
        {isMailLink(url) && (
          <>
            <MailIcon
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              className="inline-block ml-xs mb-[2px]"
            />
            <span className="sr-only">{t("common.open-in-email")}</span>
          </>
        )}
      </AppLink>
    );
  }

  return (
    <div
      data-test-id={testId}
      className={cx(linkVariants({ size, color }), "break-words", className)}
    >
      {title}
    </div>
  );
}
