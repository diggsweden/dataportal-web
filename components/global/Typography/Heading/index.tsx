import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const headingVariants = cva([], {
  variants: {
    size: {
      lg: ["text-2xl"],
      md: ["text-xl"],
      sm: ["text-lg"],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type HeadingProps = VariantProps<typeof headingVariants> & {
  level: 1 | 2 | 3 | 4;
};

const Heading: FC<
  PropsWithChildren<HeadingProps & HTMLAttributes<HTMLHeadElement>>
> = ({ size, level, className, children }) => {
  const CustomTag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <CustomTag className={cx(headingVariants({ size }), className)}>
      {children}
    </CustomTag>
  );
};

export default Heading;
