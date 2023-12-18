import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const elementVariants = cva([""], {
  variants: {
    variant: {
      h2: ["mt-lg mb-md text-xl md:mt-xl md:mb-lg md:text-2xl"],
      h3: ["mt-lg mb-sm text-lg font-bold md:mt-xl md:mb-md md:text-xl"],
      h4: ["mt-lg mb-sm text-sm font-bold md:mt-xl md:text-md"],
      p: ["mb-md text-sm font-normal md:mb-lg md:text-md"],
      a: ["text-md text-green-600 underline underline-offset-4"],
      blockquote: [
        "mb-lg border-l-4 border-l-primary-300 py-xs pl-lg italic md:mb-xl md:py-sm md:pl-xl",
      ],
      ol: [
        "mb-lg ml-lg list-decimal space-y-sm pl-sm text-sm md:mb-xl md:text-md",
      ],
      ul: ["mb-lg ml-lg list-disc space-y-sm pl-sm md:mb-xl"],
      li: ["pl-md text-sm md:text-md"],
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type ElementProps = VariantProps<typeof elementVariants> & {
  className?: string;
  href?: string;
  external?: boolean;
};

const Element: FC<PropsWithChildren<ElementProps>> = ({
  variant,
  className,
  children,
  href,
  external,
}) => {
  const CustomTag = variant as keyof JSX.IntrinsicElements;

  if (variant === "a" && href) {
    return (
      <Link
        className={cx(elementVariants({ variant }), className)}
        href={href}
        target={external ? "_blank" : "_self"}
      >
        {children}
      </Link>
    );
  } else
    return (
      <CustomTag className={cx(elementVariants({ variant }), className)}>
        {children}
      </CustomTag>
    );
};
export default Element;
