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
    position: {
      center: ["mx-auto"],
      left: ["ml-none", "mr-auto"],
    },
  },
  defaultVariants: {
    size: "xl",
    position: "center",
  },
});

type ContainerProps = VariantProps<typeof container>;

const Container: FC<
  PropsWithChildren<ContainerProps & HTMLAttributes<HTMLDivElement>>
> = ({ size, position, className, ...props }) => (
  <div className={container({ size, position, className })} {...props} />
);

export default Container;
