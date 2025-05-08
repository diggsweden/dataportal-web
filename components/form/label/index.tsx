import { FC, LabelHTMLAttributes, PropsWithChildren } from "react";

export const Label: FC<
  PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>
> = ({ children, className, ...props }) => (
  <label
    {...props}
    className={`cursor-pointer text-xl font-thin text-brown-600 ${
      className ? className : ""
    }`}
  >
    {children}
  </label>
);
