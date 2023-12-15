import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const bodyVariants = cva(
  ["prose-md prose md:prose-lg prose-quoteless text-gray-900"],
  {
    variants: {
      size: {
        h2: ["mt-lg mb-md text-xl md:mt-xl md:mb-lg md:text-2xl"],
        h3: ["mt-lg mb-sm text-lg font-bold md:mt-xl md:mb-md md:text-xl"],
        h4: ["mt-lg mb-sm text-sm font-bold md:mt-xl md:text-md"],
        p: ["mb-md text-sm font-normal md:mb-lg md:text-md"],
        a: [
          "text-sm font-normal !text-blue-500 underline underline-offset-4 md:text-md",
        ],
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
      size: "p",
    },
  },
);

type BodyProps = VariantProps<typeof bodyVariants> & {
  className?: string;
  href?: string;
};

const BodyVariant: FC<PropsWithChildren<BodyProps>> = ({
  size,
  className,
  children,
  href,
}) => {
  const CustomTag = size as keyof JSX.IntrinsicElements;
  return (
    <CustomTag className={cx(bodyVariants({ size }), className)} href={href}>
      {children}
    </CustomTag>
  );
};
export default BodyVariant;
