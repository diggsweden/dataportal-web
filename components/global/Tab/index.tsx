import { FC, PropsWithChildren } from "react";
import Link from "next/link";

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
          className={`whitespace-nowrap p-md no-underline 
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
