import React, { FC, PropsWithChildren } from "react";
import { cx, cva, VariantProps } from "class-variance-authority";

const bodyVariants = cva(["text-md"], {
  variants: {
    variant: {
      p: [""],
      ol: ["my-md list-decimal space-y-sm pl-sm"],
      ul: ["my-md ml-lg list-disc space-y-sm pl-sm md:mb-xl"],
      li: ["pl-xs text-sm md:text-md"],
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
