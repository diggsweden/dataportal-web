import type { FC, PropsWithChildren } from "react";
import { AppLink } from "@/components/link";

interface TabProps {
  href?: string;
  active: boolean;
}

export const Tab: FC<PropsWithChildren<TabProps>> = ({
  href,
  active,
  children,
}) => {
  return (
    <>
      {href ? (
        <AppLink
          href={href}
          className={`whitespace-nowrap p-sm text-sm no-underline md:p-md md:text-md 
          ${
            active
              ? "bg-pink-200 font-strong text-textPrimary "
              : "text-textSecondary hover:bg-brown-200 focus-visible:bg-brown-200"
          } `}
        >
          {children}
        </AppLink>
      ) : (
        <span className={`p-md text-textSecondary ${active && "bg-pink-200"} `}>
          {children}
        </span>
      )}
    </>
  );
};
