import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import { isExternalLink } from "@/utilities";
import Link from "next/link";
import QuoteIcon from "@/assets/icons/quote.svg";
import { CustomLink } from "../../custom-link";

const bodyVariants = cva(["text-md"], {
  variants: {
    variant: {
      p: [""],
      ol: ["my-md ml-lg list-decimal space-y-xs pl-sm"],
      ul: ["my-md ml-lg list-disc space-y-xs pl-sm"],
      li: ["pl-xs text-md"],
      a: ["[&_svg]:mb-[2px] [&_svg]:ml-xs [&_svg]:inline-block"],
      blockquote: [
        `grid grid-cols-[40px_auto] [&_p]:col-start-2 gap-lg [&_a]:text-xl [&_p]:text-xl text-pink-600 
        break-auto overflow-x-auto [&_path]:fill-primary [&_svg]:w-[1.5rem] [&_svg]:h-[1.5rem] !my-lg md:!my-xl`,
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

    if (isExternal) {
      return (
        <CustomLink
          href={href}
          className={cx(bodyVariants({ variant }), className)}
        >
          {children}
        </CustomLink>
      );
    }
    return (
      <Link
        href={href}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cx(bodyVariants({ variant }), className)}
      >
        {children}
      </Link>
    );
  }

  const CustomTag = variant as keyof JSX.IntrinsicElements;

  return (
    <CustomTag className={cx(bodyVariants({ variant }), className)}>
      {variant === "blockquote" && (
        <QuoteIcon className="col-start-1 !h-[40px] !w-[40px] flex-shrink-0" />
      )}
      {children}
    </CustomTag>
  );
};
export default BodyVariant;
