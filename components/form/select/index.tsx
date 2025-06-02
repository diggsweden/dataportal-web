import { FC, InputHTMLAttributes, PropsWithChildren, useContext } from "react";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import { SettingsContext } from "@/providers/settings-provider";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: {
    value: string;
  }[];
}

export const Select: FC<PropsWithChildren<SelectProps>> = ({
  id,
  children,
  ...props
}) => {
  const { iconSize } = useContext(SettingsContext);

  return (
    <div className="mb-md">
      <div className="Select relative mt-sm w-full bg-white md:w-3/5">
        <ChevronDownIcon
          height={iconSize * 1.5}
          width={iconSize * 1.5}
          viewBox="0 0 24 24"
          className="absolute right-md top-1/2 -translate-y-1/2"
        />
        <select
          id={id}
          className="button button--secondary button--small w-full appearance-none pr-xl"
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};
