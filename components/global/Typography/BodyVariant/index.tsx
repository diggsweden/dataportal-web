import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const bodyVariants = cva(["text-md"], {
  variants: {
    variant: {
      p: [""],
      ol: ["my-md ml-lg list-decimal space-y-xs pl-sm"],
      ul: ["my-md ml-lg list-disc space-y-xs pl-sm"],
      li: ["pl-xs text-md"],
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type BodyProps = VariantProps<typeof bodyVariants> & {
  className?: string;
  href?: string;
};

const BodyVariant: FC<PropsWithChildren<BodyProps>> = ({
  variant,
  className,
  children,
}) => {
  const CustomTag = variant as keyof JSX.IntrinsicElements;

  return (
    <CustomTag className={cx(bodyVariants({ variant }), className)}>
      {children}
    </CustomTag>
  );
};
export default BodyVariant;
