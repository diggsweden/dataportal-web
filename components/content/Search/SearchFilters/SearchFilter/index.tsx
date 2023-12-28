import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useClickoutside } from "@/hooks/useClickoutside";

export interface SearchFilterProps {
  /**
   * Title of the button to open the filter
   */
  title: String | null;
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
        <button
          className={
            (open ? "text-base open" : "text-base") + " filter-button_mobile"
          }
          onClick={() => handleOpen(!open)}
          aria-haspopup={true}
          aria-expanded={open}
        >
          <div>
            <span>{title || t("open")}</span>

            <div>
              {/*<ArrowDropIcon*/}
              {/*  rotation={open ? -180 : 0}*/}
              {/*  width={[20, 25]}*/}
              {/*  color="white"*/}
              {/*/>*/}
            </div>
          </div>
        </button>
        <div>{children}</div>
      </div>
    </FocusTrap>
  );
};
