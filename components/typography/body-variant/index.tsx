import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ElementType, FC, PropsWithChildren } from "react";

import QuoteIcon from "@/assets/icons/quote.svg";
import { isExternalLink } from "@/utilities";

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
        "flex gap-lg [&_a]:text-lg [&_p]:text-lg [&_a]:md:text-xl [&_p]:md:text-xl",
        "text-textSecondary break-auto overflow-x-auto !my-lg md:!my-xl",
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

  const CustomTag = variant as ElementType;

  return (
    <CustomTag className={cx(bodyVariants({ variant }), className)}>
      {variant === "blockquote" && <QuoteIcon className="w-xl flex-shrink-0" />}
      {children}
    </CustomTag>
  );
};
export default BodyVariant;
