import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  testId?: string;
  className?: string;
}

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";

/**
 * Native <details>/<summary> accordion — the browser handles open/close, so no
 * client JS or state. The chevron rotates via the `open:` group variant.
 */
export function Accordion({
  title,
  children,
  defaultOpen = true,
  testId,
  className,
}: AccordionProps) {
  return (
    <details
      data-test-id={testId}
      open={defaultOpen}
      className={cx("group/accordion", className)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-sm py-md text-lg [&::-webkit-details-marker]:hidden">
        <ChevronDownIcon
          width={24}
          height={24}
          className="flex-shrink-0 duration-300 transition-transform group-open/accordion:rotate-180"
        />
        <span>{title}</span>
      </summary>
      {children}
    </details>
  );
}
