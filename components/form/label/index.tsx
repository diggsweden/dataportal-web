import type { FC, LabelHTMLAttributes, PropsWithChildren } from "react";

export const Label: FC<
  PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>
> = ({ children, className, htmlFor, ...props }) => (
  <label
    htmlFor={htmlFor}
    {...props}
    className={`cursor-pointer break-words text-lg font-thin text-brown-600 lg:text-xl ${
      className ? className : ""
    }`}
  >
    {children}
  </label>
);
