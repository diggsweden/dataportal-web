import React, { FC, InputHTMLAttributes, PropsWithChildren } from "react";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
}

export const Select: FC<PropsWithChildren<SelectProps>> = ({
  id,
  label,
  children,
  ...props
}) => (
  <div className="Select">
    <label className="sr-only" htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      className="button button--secondary button--small appearance-none bg-[url('/icons/chevronDown.svg')]
     bg-[95%] bg-no-repeat pr-xl"
      name={label}
      {...props}
    >
      {children}
    </select>
  </div>
);
