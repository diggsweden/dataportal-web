import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import { Button } from "@/components/button";
import { useClickOutside } from "@/hooks/use-click-outside";

export interface SearchFilterProps {
  title: string | null;
  usedFilters?: string;
  defaultValue?: boolean;
}

export const SearchFilter: FC<PropsWithChildren<SearchFilterProps>> = ({
  title,
  usedFilters,
  defaultValue,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => handleOpen(false));
  const { t } = useTranslation("common");

  const handleOpen = (value: boolean) => {
    setOpen(value);
    setTrapFocus(value);
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
      >
        <Button
          variant="secondary"
          size="md"
          label={`${title} ${usedFilters || ""}` || t("open")}
          aria-haspopup={true}
          aria-expanded={open}
          aria-label={`${
            open ? t("close-filter") : t("open-filter")
          } ${title} ${
            usedFilters ? ` - ${usedFilters} ${t("active-filters")}` : ""
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
};
