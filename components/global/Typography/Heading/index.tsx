import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const headingVariants = cva(["text-wrap"], {
  variants: {
    size: {
      lg: ["text-xl md:text-2xl mb-lg"],
      md: ["text-lg md:text-xl mb-md md:mb-lg"],
      sm: ["text-md md:text-lg mb-md"],
      xs: ["text-sm md:text-md mb-sm md:mb-md"],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type HeadingProps = VariantProps<typeof headingVariants> & {
  level: 1 | 2 | 3 | 4 | 5;
  tabIndex?: number;
};

export const Heading: FC<
  PropsWithChildren<HeadingProps & HTMLAttributes<HTMLElement>>
> = ({ size, level, className, tabIndex, children }) => {
  const CustomTag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <CustomTag
      className={cx(headingVariants({ size }), className)}
      tabIndex={level === 1 || tabIndex === 0 ? 0 : -1}
    >
      {children}
    </CustomTag>
  );
};
