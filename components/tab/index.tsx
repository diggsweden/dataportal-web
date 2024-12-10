import Link from "next/link";
import { FC, PropsWithChildren } from "react";

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
        <Link
          href={href}
          className={`whitespace-nowrap p-sm text-sm no-underline md:p-md md:text-md 
          ${
            active
              ? "bg-pink-200 font-strong text-textPrimary "
              : "text-textSecondary hover:bg-brown-200 focus-visible:bg-brown-200"
          } `}
        >
          {children}
        </Link>
      ) : (
        <span className={`p-md text-textSecondary ${active && "bg-pink-200"} `}>
          {children}
        </span>
      )}
    </>
  );
};
