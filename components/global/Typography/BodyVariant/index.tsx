import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import { isExternalLink, isMailLink } from "@/utilities";
import Link from "next/link";
import QuoteIcon from "@/assets/icons/quote.svg";
import MailIcon from "@/assets/icons/mail.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";

const bodyVariants = cva(["text-md"], {
  variants: {
    variant: {
      p: [""],
      ol: ["my-md ml-lg list-decimal space-y-xs pl-sm"],
      ul: ["my-md ml-lg list-disc space-y-xs pl-sm"],
      li: ["pl-xs text-md"],
      a: ["[&_svg]:mb-[2px] [&_svg]:ml-xs [&_svg]:inline-block"],
      blockquote: [
        `grid grid-cols-[40px_auto] [&_p]:col-start-2 gap-lg  md:[&_a]:text-xl  md:[&_p]:text-xl 
        text-pink-600 break-auto overflow-x-auto [&_path]:fill-primary [&_svg]:w-[24px] [&_svg]:h-[24px]
        [&_p]:text-lg [&_a]:text-lg !my-lg md:!my-xl`,
      ],
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type BodyProps = VariantProps<typeof bodyVariants> & {
  className?: string;
  href?: string;
};

const BodyVariant: FC<PropsWithChildren<BodyProps>> = ({
  variant,
  href,
  className,
  children,
}) => {
  if (variant === "a" && href) {
    const isExternal = isExternalLink(href);

    return (
      <Link
        href={href}
        onClick={() => {
          if (!isExternal) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        aria-label={
          isMailLink(href)
            ? "email_link"
            : isExternal
            ? "external_link"
            : "internal_link"
        }
        className={cx(bodyVariants({ variant }), className)}
      >
        {children}
        {isMailLink(href) && (
          <MailIcon width={16} height={16} viewBox="0 0 24 24" />
        )}
        {isExternal && !isMailLink(href) && (
          <ExternalLinkIcon width={16} height={16} viewBox="0 0 24 24" />
        )}
      </Link>
    );
  }

  const CustomTag = variant as keyof JSX.IntrinsicElements;

  return (
    <CustomTag className={cx(bodyVariants({ variant }), className)}>
      {variant === "blockquote" && (
        <QuoteIcon className="col-start-1 !h-[40px] !w-[40px]" />
      )}
      {children}
    </CustomTag>
  );
};
export default BodyVariant;
