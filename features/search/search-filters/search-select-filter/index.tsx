import FocusTrap from "focus-trap-react";
import { FC, useContext, useState } from "react";

import CheckDoneIcon from "@/assets/icons/check-done.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import { Button } from "@/components/button";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SettingsContext } from "@/providers/settings-provider";

interface SelectProps {
  id: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (_value: { target: { value: string } }) => void;
}

export const SearchSelectFilter: FC<SelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);
  const { iconSize } = useContext(SettingsContext);
  const ref = useClickOutside<HTMLDivElement>(() => handleOpen(false));

  const handleOpen = (value: boolean) => {
    setOpen(value);
    setTrapFocus(value);
  };

  const selectedOption = options.find((option) => option.value === value);
  const selectedText = selectedOption ? selectedOption.label : label;

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
          id={id}
          size="md"
          variant="secondary"
          iconPosition="right"
          icon={open ? ChevronUpIcon : ChevronDownIcon}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => handleOpen(!open)}
          aria-labelledby={id}
          label={selectedText}
          className="hover:bg-brown-100 focus-visible:bg-brown-100"
        />
        {open && (
          <div className={open ? "relative block" : "hidden"}>
            <ul
              className="absolute z-10 mt-sm border border-brown-200 bg-white shadow-lg"
              role="listbox"
              aria-labelledby={id}
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`inline-flex w-full cursor-pointer hover:bg-brown-100`}
                  onClick={() => {
                    onChange({ target: { value: option.value } });
                    handleOpen(false);
                  }}
                >
                  <button
                    className={`focus--in relative w-full text-nowrap py-sm pl-[2.25rem] pr-md text-left text-sm ${
                      selectedOption?.value === option.value
                        ? "bg-brown-100"
                        : ""
                    }`}
                  >
                    {selectedOption?.value === option.value && (
                      <CheckDoneIcon
                        className="absolute mt-xs -translate-x-[1.5rem]"
                        height={iconSize}
                        width={iconSize}
                        viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
                      />
                    )}
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FocusTrap>
  );
};
