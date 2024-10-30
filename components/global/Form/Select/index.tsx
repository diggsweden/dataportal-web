import { FC, InputHTMLAttributes, PropsWithChildren, useContext } from "react";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import { SettingsContext } from "@/providers/SettingsProvider";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
}

export const Select: FC<PropsWithChildren<SelectProps>> = ({
  id,
  label,
  children,
  ...props
}) => {
  const { iconSize } = useContext(SettingsContext);

  return (
    <div className="Select relative">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <ChevronDownIcon
        height={iconSize * 1.5}
        width={iconSize * 1.5}
        viewBox="0 0 24 24"
        className="absolute right-md top-1/2 -translate-y-1/2"
      />
      <select
        id={id}
        className="button button--secondary button--small appearance-none pr-xl"
        name={label}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
