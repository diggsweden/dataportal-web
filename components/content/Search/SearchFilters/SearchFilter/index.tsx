import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import { SettingsContext } from "@/providers/SettingsProvider";

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
  const { iconSize } = useContext(SettingsContext);
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
          } button button--secondary button--large md:button--small w-full justify-between md:justify-start md:py-[0.25rem]`}
        >
          {title || t("open")}
          <ChevronDownIcon
            height={iconSize * 1.5}
            width={iconSize * 1.5}
            viewBox="0 0 24 24"
          />
        </button>
        <div className={open ? "relative block md:static" : "hidden"}>
          {children}
        </div>
      </div>
    </FocusTrap>
  );
};
