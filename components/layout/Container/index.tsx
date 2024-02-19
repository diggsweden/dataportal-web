import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { cva, VariantProps } from "class-variance-authority";

const container = cva(["container"], {
  variants: {
    size: {
      sm: ["max-w-sm"],
      md: ["max-w-md"],
      lg: ["max-w-lg"],
      xl: ["max-w-xl"],
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

type ContainerProps = VariantProps<typeof container>;

export const Container: FC<
  PropsWithChildren<ContainerProps & HTMLAttributes<HTMLDivElement>>
> = ({ size, className, ...props }) => (
  <div className={container({ size, className })} {...props} />
);
