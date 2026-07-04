"use client";

import FocusTrap from "focus-trap-react";
import { useTranslations } from "next-intl";
import { type PropsWithChildren, useEffect, useState } from "react";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import { Button } from "@/components/button";
import { useClickOutside } from "@/hooks/use-click-outside";

export interface SearchFilterProps {
  title: string | null;
  usedFilters?: string;
  defaultValue?: boolean;
  onOpen?: () => void;
}

export function SearchFilter({
  title,
  usedFilters,
  defaultValue,
  children,
  onOpen,
  ...props
}: PropsWithChildren<SearchFilterProps>) {
  const [open, setOpen] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => handleOpen(false));
  const t = useTranslations();

  const handleOpen = (value: boolean) => {
    setOpen(value);
    setTrapFocus(value);
    if (value && onOpen) {
      onOpen();
    }
  };

  useEffect(() => {
    setOpen(defaultValue || false);
  }, []);

  return (
    <FocusTrap
      active={trapFocus}
      focusTrapOptions={{ allowOutsideClick: true }}
    >
      <div
        ref={ref}
        onKeyDown={(ev) => ev.key === "Escape" && handleOpen(false)}
        {...props}
      >
        <Button
          variant="secondary"
          size="md"
          label={`${title} ${usedFilters || ""}` || t("common.open")}
          aria-haspopup={true}
          aria-expanded={open}
          aria-label={`${
            open ? t("common.close-filter") : t("common.open-filter")
          } ${title} ${
            usedFilters ? ` - ${usedFilters} ${t("common.active-filters")}` : ""
          }`}
          onClick={() => handleOpen(!open)}
          className={
            open
              ? "active"
              : "bg-white hover:bg-transparent focus-visible:bg-transparent"
          }
          icon={open ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
        />

        <div className={open ? "relative block md:static" : "hidden"}>
          {children}
        </div>
      </div>
    </FocusTrap>
  );
}
