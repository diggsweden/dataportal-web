import { FC, LabelHTMLAttributes, PropsWithChildren } from "react";

export const Label: FC<
  PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>
> = ({ children, className, ...props }) => (
  <label
    {...props}
    className={`cursor-pointer text-sm font-strong ${
      className ? className : ""
    }`}
  >
    {children}
  </label>
);
