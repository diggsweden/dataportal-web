import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";

export interface SearchFilterProps {
  title: string | null;
  defaultValue?: boolean;
}

export const SearchFilter: FC<PropsWithChildren<SearchFilterProps>> = ({
  title,
  defaultValue,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);
  const ref = useClickoutside(() => handleOpen(false));
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
        <button
          aria-haspopup={true}
          aria-expanded={open}
          onClick={() => handleOpen(!open)}
          className={`${
            open && "active"
          } button button--secondary button--large md:button--small w-full justify-between md:justify-start`}
        >
          {title || t("open")}
          <ChevronDownIcon />
        </button>
        <div className={open ? "relative block md:static" : "hidden"}>
          {children}
        </div>
      </div>
    </FocusTrap>
  );
};
