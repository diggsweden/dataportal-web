"use client";

import { useTranslations } from "next-intl";
import { type FC, type ReactNode, useContext, useState } from "react";

import CrossIcon from "@/assets/icons/cross.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { SettingsContext } from "@/providers/settings-provider";

interface AccordionTriggerProps {
  question: string;
  idx: number;
  children: ReactNode;
}

export const AccordionTrigger: FC<AccordionTriggerProps> = ({
  question,
  idx,
  children,
}) => {
  const t = useTranslations();
  const { iconSize } = useContext(SettingsContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id={`accordion-${idx}`}
        className="group inline-flex w-full flex-row items-center justify-between gap-md hyphens-auto py-lg text-start"
        onClick={() => setOpen(!open)}
        aria-label={
          open
            ? `${t("common.close")} FAQ ${question}`
            : `${t("common.open")} FAQ ${question}`
        }
        aria-expanded={open}
        aria-controls={`section-${idx}`}
      >
        <span className="text-lg underline-offset-4 group-hover:underline">
          {question}
        </span>
        <span className="flex-shrink-0 text-green-600">
          {open ? (
            <CrossIcon width={iconSize * 1.5} height={iconSize * 1.5} />
          ) : (
            <PlusIcon width={iconSize * 1.5} height={iconSize * 1.5} />
          )}
        </span>
      </button>
      {open && (
        <section
          id={`section-${idx}`}
          aria-labelledby={`accordion-${idx}`}
          className="space-y-md pb-lg"
        >
          {children}
        </section>
      )}
    </>
  );
};
