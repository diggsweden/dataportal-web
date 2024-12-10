import { cva, VariantProps } from "class-variance-authority";
import React, { FC, HTMLAttributes, PropsWithChildren } from "react";

const preabmle = cva(["text-lg"], {
  variants: {
    color: {
      light: ["text-brown-100"],
      dark: ["text-textSecondary"],
    },
  },
  defaultVariants: {
    color: "dark",
  },
});

type PreambleProps = VariantProps<typeof preabmle>;

export const Preamble: FC<
  PropsWithChildren<PreambleProps & HTMLAttributes<HTMLDivElement>>
> = ({ color, children, className }) => (
  <div className={preabmle({ color, className })}>{children}</div>
);
