import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const headingVariants = cva(["text-wrap"], {
  variants: {
    size: {
      lg: ["text-xl md:text-2xl"],
      md: ["text-lg md:text-xl"],
      sm: ["text-md md:text-lg"],
      xs: ["text-sm md:text-md"],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type HeadingProps = VariantProps<typeof headingVariants> & {
  level: 1 | 2 | 3 | 4 | 5;
};

export const Heading: FC<
  PropsWithChildren<HeadingProps & HTMLAttributes<HTMLElement>>
> = ({ size, level, className, children }) => {
  const CustomTag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <CustomTag className={cx(headingVariants({ size }), className)}>
      {children}
    </CustomTag>
  );
};
