import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import { Button } from "@/components/global/Button";

export interface SearchFilterProps {
  /**
   * Title of the button to open the filter
   */
  title: string | null;
  /**
   * Default value for 'open' state
   */
  defaultValue?: boolean;
  /**
   * Content in the filter
   */
  children?: React.ReactNode;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
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
        <Button
          variant="secondary"
          size="sm"
          label={title || t("open")}
          icon={ChevronDownIcon}
          iconPosition="right"
          aria-haspopup={true}
          aria-expanded={open}
          onClick={() => handleOpen(!open)}
          className={(open && "active") + " filter-button_mobile"}
        />
        <div className={open ? "block" : "hidden"}>{children}</div>
      </div>
    </FocusTrap>
  );
};
