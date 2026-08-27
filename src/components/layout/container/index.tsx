import { cva, type VariantProps } from "class-variance-authority";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";

const container = cva(["container"], {
  variants: {
    size: {
      sm: ["max-w-sm"],
      md: ["max-w-md"],
      lg: ["max-w-lg"],
      xl: ["max-w-xl"],
      full: ["max-w-none"],
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

export type ContainerSize = NonNullable<VariantProps<typeof container>["size"]>;

type ContainerProps = VariantProps<typeof container>;

export const Container: FC<
  PropsWithChildren<ContainerProps & HTMLAttributes<HTMLDivElement>>
> = ({ size, className, ...props }) => (
  <div className={container({ size, className })} {...props} />
);
