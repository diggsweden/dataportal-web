import React, { FC, HTMLAttributes, HTMLProps, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const headingVariants = cva([], {
  variants: {
    size: {
      h1: ["text-5xl"],
      h2: ["text-4xl"],
      h3: ["text-3xl"],
      h4: ["text-2xl"],
      h5: ["text-xl"],
    },
  },
  defaultVariants: {
    size: "h1",
  },
});

type HeadingProps = VariantProps<typeof headingVariants>;

const Heading: FC<
  PropsWithChildren<HeadingProps & HTMLAttributes<HTMLHeadElement>>
> = ({ size, className, children }) => {
  const CustomTag = size as keyof JSX.IntrinsicElements;
  return (
    <CustomTag className={cx(headingVariants({ size }), className)}>
      {children}
    </CustomTag>
  );
};

export default Heading;
