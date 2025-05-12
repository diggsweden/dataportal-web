import { cva, VariantProps } from "class-variance-authority";
import React, { FC, HTMLAttributes, PropsWithChildren } from "react";

const preabmle = cva(["text-lg"], {
  variants: {
    color: {
      light: ["text-brown-100"],
      dark: ["text-textSecondary"],
      primary: ["text-textPrimary"],
    },
  },
  defaultVariants: {
    color: "dark",
  },
});

type PreambleProps = VariantProps<typeof preabmle>;

export const Preamble: FC<
  PropsWithChildren<PreambleProps & HTMLAttributes<HTMLDivElement>>
> = ({ color, children, className, ...props }) => (
  <div className={preabmle({ color, className })} {...props}>
    {children}
  </div>
);
