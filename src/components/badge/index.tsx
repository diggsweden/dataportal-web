import { cva, cx, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";

const badgeVariants = cva(["px-sm py-xs text-sm uppercase"], {
  variants: {
    color: {
      "light-green": "bg-green-200",
      "dark-green": "bg-green-600 text-white",
    },
  },
  defaultVariants: {
    color: "light-green",
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  text?: string;
  className?: string;
  id?: string;
  children?: ReactNode;
}

export const Badge: FC<BadgeProps> = ({
  text,
  color,
  className,
  id,
  children,
  ...props
}) => {
  return (
    <span
      id={id}
      className={cx(badgeVariants({ color }), className)}
      {...props}
    >
      {text && text}
      {children}
    </span>
  );
};
