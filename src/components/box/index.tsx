import { cva, cx, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const boxVariants = cva("box-border w-full shadow-sm", {
  variants: {
    color: {
      white: "bg-white",
      pink: "bg-pink-100",
      pinkStrong: "bg-pink-200",
      green: "bg-green-100",
    },
    padding: {
      md: "p-md",
      lg: "p-lg",
      xl: "p-xl",
    },
    rounded: {
      true: "rounded-lg",
      false: "",
    },
  },
  defaultVariants: {
    color: "white",
    padding: "md",
    rounded: false,
  },
});

interface BoxProps extends VariantProps<typeof boxVariants> {
  className?: string;
  testId?: string;
  children: ReactNode;
}

/**
 * Presentational shell for the panels used across the resource (and regular)
 * pages: a coloured background with padding, optionally rounded. Purely visual —
 * headings and content live in `children`. Width, margin and any layout specific
 * to a placement come via `className`, so the component only owns "what a box is".
 */
export function Box({
  color = "white",
  padding = "md",
  rounded = false,
  className,
  testId,
  children,
}: BoxProps) {
  return (
    <div
      data-test-id={testId}
      className={cx(boxVariants({ color, padding, rounded }), className)}
    >
      {children}
    </div>
  );
}
